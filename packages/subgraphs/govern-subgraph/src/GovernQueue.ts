import { Address, Bytes, BigInt, log } from "@graphprotocol/graph-ts";
import {
  Challenged as ChallengedEvent,
  Configured as ConfiguredEvent,
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Resolved as ResolvedEvent,
  Revoked as RevokedEvent,
  Scheduled as ScheduledEvent,
  Vetoed as VetoedEvent,
} from "../generated/GovernQueue/GovernQueue";

import { GovernQueue as GovernQueueContract } from "../generated/GovernQueue/GovernQueue";
import { getERC20Info } from "./utils/tokens";

import {
  Action,
  Collateral,
  Config,
  Container,
  Payload,
  GovernQueue,
  ContainerEventResolve,
} from "../generated/schema";
import { frozenRoles, roleGranted, roleRevoked } from "./lib/MiniACL";
import { buildEventHandlerId, buildId, buildIndexedId } from "./utils/ids";
import {
  ZERO_ADDRESS,
  APPROVED_STATUS,
  VETOED_STATUS,
  CHALLENGED_STATUS,
  EXECUTED_STATUS,
  NONE_STATUS,
  REJECTED_STATUS,
  SCHEDULED_STATUS,
} from "./utils/constants";
import {
  finalizeContainerEvent,
  handleContainerEventChallenge,
  handleContainerEventSchedule,
  handleContainerEventVeto,
} from "./utils/events";

import { loadOrCreateGovern } from "./Govern";

export function handleScheduled(event: ScheduledEvent): void {
  log.info("handleScheduled, {}", [event.params.containerHash.toHex()]);
  let queue = loadOrCreateQueue(event.address);
  let payload = loadOrCreatePayload(event.params.containerHash);
  let container = loadOrCreateContainer(
    event.params.containerHash,
    event.address.toHex()
  );
  let executor = loadOrCreateGovern(event.params.payload.executor);

  // Builds each of the actions bundled in the payload,
  // and saves them to the DB.
  buildActions(event);

  payload.nonce = event.params.payload.nonce;
  payload.executionTime = event.params.payload.executionTime;
  payload.submitter = event.params.payload.submitter;
  payload.executor = executor.id;
  payload.allowFailuresMap = event.params.payload.allowFailuresMap;
  payload.proof = event.params.payload.proof;

  container.payload = payload.id;
  container.state = SCHEDULED_STATUS;
  container.createdAt = event.block.timestamp;
  // This should always be possible, as a queue without a config
  // should be impossible to get at this stage
  container.config = queue.config;
  container.queue = queue.id;
  let config = loadConfig(queue.config);
  let scheduleDeposit = loadCollateral(config.scheduleDeposit);

  handleContainerEventSchedule(container, event, scheduleDeposit);

  executor.save();
  payload.save();
  container.save();
  queue.save();
}

export function handleExecuted(event: ExecutedEvent): void {
  log.info("handleExecuted, {}", [event.params.containerHash.toHex()]);
  let container = loadOrCreateContainer(
    event.params.containerHash,
    event.address.toHex()
  );
  container.state = EXECUTED_STATUS;
  container.save();
}

export function handleChallenged(event: ChallengedEvent): void {
  log.info("handleChallenged, {}", [event.params.containerHash.toHex()]);
  let queue = loadOrCreateQueue(event.address);
  let container = loadOrCreateContainer(event.params.containerHash, queue.id);

  container.state = CHALLENGED_STATUS;

  let resolver = Config.load(queue.config)!.resolver;
  let containerEvent = handleContainerEventChallenge(
    container,
    event,
    resolver
  );

  containerEvent.save();
  container.save();
  queue.save();
}

export function handleResolved(event: ResolvedEvent): void {
  log.info("handleResolved, {}", [event.params.containerHash.toHex()]);
  let container = loadOrCreateContainer(
    event.params.containerHash,
    event.address.toHex()
  );

  container.state = event.params.approved ? APPROVED_STATUS : REJECTED_STATUS;

  let eventId = buildEventHandlerId(
    container.id,
    "resolve",
    event.transactionLogIndex.toHexString()
  );

  let containerEvent = new ContainerEventResolve(eventId);
  containerEvent.ruling = event.params.approved ? 4 : 3;

  finalizeContainerEvent<ResolvedEvent, ContainerEventResolve>(
    container,
    containerEvent,
    event
  );

  container.save();
}

export function handleVetoed(event: VetoedEvent): void {
  log.info("handleVetoed, {}", [event.params.containerHash.toHex()]);
  let queue = loadOrCreateQueue(event.address);
  let container = loadOrCreateContainer(
    event.params.containerHash,
    event.address.toHex()
  );

  container.state = VETOED_STATUS;

  handleContainerEventVeto(container, event);

  container.save();
  queue.save();
}

export function handleConfigured(event: ConfiguredEvent): void {
  log.info("handleConfigured, {}", [event.transaction.hash.toHex()]);
  let queue = loadOrCreateQueue(event.address);

  let configId = buildId(event);
  let config = new Config(configId);
  let scheduleDeposit = new Collateral(
    buildIndexedId(event.transaction.hash.toHex(), 1)
  );
  scheduleDeposit.token = event.params.config.scheduleDeposit.token;
  scheduleDeposit.amount = event.params.config.scheduleDeposit.amount;

  let challengeDeposit = new Collateral(
    buildIndexedId(event.transaction.hash.toHex(), 2)
  );
  challengeDeposit.token = event.params.config.challengeDeposit.token;
  challengeDeposit.amount = event.params.config.challengeDeposit.amount;

  // Grab Schedule Token info
  let data = getERC20Info(event.params.config.scheduleDeposit.token);
  scheduleDeposit.decimals = data.decimals!.toI32();
  scheduleDeposit.name = data.name;
  scheduleDeposit.symbol = data.symbol;

  // Grab challenge Token info
  data = getERC20Info(event.params.config.challengeDeposit.token);
  challengeDeposit.decimals = data.decimals!.toI32();
  challengeDeposit.name = data.name;
  challengeDeposit.symbol = data.symbol;

  config.executionDelay = event.params.config.executionDelay;
  config.scheduleDeposit = scheduleDeposit.id;
  config.challengeDeposit = challengeDeposit.id;
  config.resolver = event.params.config.resolver;
  config.rules = event.params.config.rules;
  config.maxCalldataSize = event.params.config.maxCalldataSize;

  scheduleDeposit.save();
  queue.config = config.id;

  scheduleDeposit.save();
  challengeDeposit.save();
  config.save();
  queue.save();
}

// MiniACL Events

export function handleFrozen(event: FrozenEvent): void {
  log.info("handleFrozen, {}", [event.transaction.hash.toHex()]);
  let queue = loadOrCreateQueue(event.address);

  let roles = queue.roles;

  frozenRoles(roles, event.params.role);
}

export function handleGranted(event: GrantedEvent): void {
  log.info("handleGranted, {}", [event.transaction.hash.toHex()]);
  let queue = loadOrCreateQueue(event.address);

  let role = roleGranted(event.address, event.params.role, event.params.who);

  // add the role
  let currentRoles = queue.roles;
  currentRoles.push(role.id);
  queue.roles = currentRoles;

  queue.save();
}

export function handleRevoked(event: RevokedEvent): void {
  log.info("handleRevoked, {}", [event.transaction.hash.toHex()]);
  let queue = loadOrCreateQueue(event.address);

  let role = roleRevoked(event.address, event.params.role, event.params.who);

  // add the role
  let currentRoles = queue.roles;
  currentRoles.push(role.id);
  queue.roles = currentRoles;

  queue.save();
}

// create a dummy config when creating queue to avoid not-null error
export function createDummyConfig(queueId: string): string {
  log.info("createDummyConfig, {}", [queueId]);
  let ZERO = BigInt.fromI32(0);

  let configId = queueId;
  let config = new Config(configId);

  let scheduleDeposit = new Collateral(buildIndexedId(configId, 1));
  scheduleDeposit.token = ZERO_ADDRESS;
  scheduleDeposit.amount = ZERO;

  let challengeDeposit = new Collateral(buildIndexedId(configId, 2));
  challengeDeposit.token = ZERO_ADDRESS;
  challengeDeposit.amount = ZERO;

  config.executionDelay = ZERO;
  config.scheduleDeposit = scheduleDeposit.id;
  config.challengeDeposit = challengeDeposit.id;
  config.resolver = ZERO_ADDRESS;
  config.rules = Bytes.fromI32(0);
  config.maxCalldataSize = BigInt.fromI32(0);
  scheduleDeposit.save();
  challengeDeposit.save();
  config.save();

  return config.id;
}

export function loadOrCreateQueue(queueAddress: Address): GovernQueue {
  log.info("loadOrCreateQueue, {}", [queueAddress.toHex()]);
  let queueId = queueAddress.toHex();
  // Create queue
  let queue = GovernQueue.load(queueId);
  if (queue === null) {
    log.info("loadOrCreateQueue, create new queue, {}", [queueId]);
    queue = new GovernQueue(queueId);
    queue.address = queueAddress;
    queue.config = createDummyConfig(queueId);
    queue.roles = [];
  }
  queue.nonce = GovernQueueContract.bind(queueAddress).nonce();

  return queue;
}

export function loadOrCreateContainer(
  containerHash: Bytes,
  queue: string
): Container {
  log.info("loadOrCreateContainer, {}", [containerHash.toHex()]);
  let ContainerId = containerHash.toHex();
  // Create container
  let container = Container.load(ContainerId);
  if (container === null) {
    log.info("loadOrCreateContainer, create new container, {}", [ContainerId]);
    container = new Container(ContainerId);
    container.state = NONE_STATUS;
    container.queue = queue;
    container.config = createDummyConfig(queue);
    container.payload = "temp";
    container.createdAt = BigInt.fromI32(0);
  }
  return container;
}

export function loadOrCreatePayload(containerHash: Bytes): Payload {
  log.info("loadOrCreatePayload, {}", [containerHash.toHex()]);
  let PayloadId = containerHash.toHex();
  // Create payload
  let payload = Payload.load(PayloadId);
  if (payload === null) {
    log.info("loadOrCreatePayload, create new payload, {}", [PayloadId]);
    payload = new Payload(PayloadId);
    payload.nonce = BigInt.fromI32(0);
    payload.executionTime = BigInt.fromI32(0);
    payload.submitter = ZERO_ADDRESS;
    payload.executor = ZERO_ADDRESS.toHex();
    payload.allowFailuresMap = Bytes.fromI32(0);
    payload.proof = Bytes.fromI32(0);
  }

  return payload;
}

export function loadConfig(configAddress: string): Config {
  log.info("loadConfig, {}", [configAddress]);
  let config = Config.load(configAddress);
  if (config === null) {
    throw new Error("Config not found.");
  }
  return config;
}

export function loadCollateral(collateralAddress: string): Collateral {
  log.info("loadCollateral, {}", [collateralAddress]);
  let collateral = Collateral.load(collateralAddress);
  if (collateral === null) {
    throw new Error("Collateral not found.");
  }
  return collateral;
}

export function buildActions(event: ScheduledEvent): void {
  log.info("buildActions, {}", [event.transaction.hash.toHex()]);
  let actions = event.params.payload.actions;
  for (let index = 0; index < actions.length; index++) {
    let actionId = buildIndexedId(event.params.containerHash.toHex(), index);
    let action = new Action(actionId);

    action.to = actions[index].to;
    action.value = actions[index].value;
    action.data = actions[index].data;
    action.payload = event.params.containerHash.toHex();

    action.save();
  }
}
