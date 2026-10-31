import { BigNumber, Contract, ethers } from 'ethers';
import { ConfigModel, ContainerModel } from 'src/models/govern.model';
import { TokenModel } from 'src/models/token.model';
import { getQuestContract, getTokenInfo } from 'src/utils/contract.util';
import { getRpcUrl } from 'src/utils/web3.utils';
import contracts from '../contracts/hardhat_contracts.json';

// Deployment blocks and queue addresses from govern-subgraph/manifest/data/gnosis.json.
// The queue contract has no method to enumerate its containers or past configs.
const QUEUES = [
  { address: '0xd8D142f13E58dFEedaF96418C0B6843108d46B94', fromBlock: 22769097 },
  { address: '0x6D8189C979bBB6768395A78E2AB8A15133459600', fromBlock: 25719047 },
  { address: '0x8A33E3015F1a9aBdFd6822E218Eb725021D73EaC', fromBlock: 29612408 },
];
const EXEC_ROLE = '0xc2d85afc';
const ZERO = ethers.constants.AddressZero;
const queueAbi = contracts[100].xdai.contracts.GovernQueue[0].abi;
const queueV2Scheduled = contracts[100].xdai.contracts.GovernQueue[1].abi.find(
  (entry) => entry.type === 'event' && entry.name === 'Scheduled',
);
const governAbi = contracts[100].xdai.contracts.Govern.abi;
const queueInterface = new ethers.utils.Interface([
  ...queueAbi,
  ...(queueV2Scheduled ? [queueV2Scheduled] : []),
  // GovernQueue V3 changed the Resolved event's final argument to a ruling.
  'event Resolved(bytes32 indexed containerHash, address indexed actor, uint256 ruling)',
]);
let chainProvider: ethers.providers.StaticJsonRpcProvider | undefined;
function provider() {
  if (!chainProvider)
    chainProvider = new ethers.providers.StaticJsonRpcProvider(getRpcUrl(100), 100);
  return chainProvider;
}

type QueueEvent = {
  address: string;
  blockNumber: number;
  logIndex: number;
  name: string;
  args: ethers.utils.Result;
};
type QueueSnapshot = { containers: ContainerModel[]; events: QueueEvent[]; loadedAt: number };
let snapshot: QueueSnapshot | undefined;
let pendingSnapshot: Promise<QueueSnapshot> | undefined;
let snapshotGeneration = 0;

export function invalidateOnchainGovernSnapshot() {
  snapshotGeneration += 1;
  snapshot = undefined;
  pendingSnapshot = undefined;
}

function queueContract(address: string): Contract {
  return new Contract(address, queueAbi, provider());
}

async function tokenAmount(collateral: any): Promise<TokenModel> {
  const info = await getTokenInfo(collateral.token);
  if (!info) throw new Error(`Could not read collateral token ${collateral.token}`);
  return { ...info, amount: collateral.amount.toString() };
}

async function mapConfig(config: any): Promise<ConfigModel> {
  const [scheduleDeposit, challengeDeposit] = await Promise.all([
    tokenAmount(config.scheduleDeposit),
    tokenAmount(config.challengeDeposit),
  ]);
  return {
    executionDelay: config.executionDelay.toNumber(),
    scheduleDeposit,
    challengeDeposit,
    resolver: config.resolver,
    rules: config.rules,
    maxCalldataSize: config.maxCalldataSize.toNumber(),
  };
}

async function readQueueEvents(): Promise<QueueEvent[]> {
  const topics = [
    'Configured',
    'Scheduled',
    'Executed',
    'Challenged',
    'Resolved',
    'Vetoed',
  ].flatMap((name) =>
    queueInterface.events
      ? Object.values(queueInterface.events)
          .filter((event) => event.name === name)
          .map((event) => queueInterface.getEventTopic(event))
      : [],
  );
  const batches = await Promise.all(
    QUEUES.map(async ({ address, fromBlock }) => {
      const logs = await provider().getLogs({
        address,
        fromBlock,
        toBlock: 'latest',
        topics: [topics],
      });
      return logs.map((log) => {
        const parsed = queueInterface.parseLog(log);
        return {
          address: ethers.utils.getAddress(log.address),
          blockNumber: log.blockNumber,
          logIndex: log.logIndex,
          name: parsed.name,
          args: parsed.args,
        };
      });
    }),
  );
  return batches.flat().sort((a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex);
}

async function loadSnapshot(): Promise<QueueSnapshot> {
  if (snapshot && Date.now() - snapshot.loadedAt < 30_000) return snapshot;
  if (pendingSnapshot) return pendingSnapshot;
  const generation = snapshotGeneration;
  const work = (async () => {
    const events = await readQueueEvents();
    const mappedConfigs = await Promise.all(
      events.map((event) =>
        event.name === 'Configured' ? mapConfig(event.args.config) : Promise.resolve(undefined),
      ),
    );
    const configs = new Map<string, ConfigModel>();
    const containers = new Map<string, ContainerModel>();
    events.forEach((event, index) => {
      const queue = event.address.toLowerCase();
      if (event.name === 'Configured') {
        configs.set(queue, mappedConfigs[index] as ConfigModel);
      } else if (event.name === 'Scheduled') {
        const { payload } = event.args;
        const config = configs.get(queue);
        if (!config) throw new Error(`Queue ${event.address} has no configured deposit`);
        containers.set(event.args.containerHash.toLowerCase(), {
          id: event.args.containerHash,
          payload: {
            nonce: payload.nonce.toNumber(),
            executionTime: payload.executionTime.toNumber(),
            submitter: payload.submitter,
            executor: payload.executor,
            actions: payload.actions.map((action: any) => ({
              to: action.to,
              value: action.value.toNumber(),
              data: action.data,
            })),
            allowFailuresMap: payload.allowFailuresMap,
            proof: payload.proof,
            challenger: ZERO,
          },
          config,
          state: 'Scheduled',
        });
      } else {
        const container = containers.get(event.args.containerHash?.toLowerCase());
        if (!container) return;
        if (event.name === 'Executed') container.state = 'Executed';
        if (event.name === 'Challenged') container.state = 'Challenged';
        if (event.name === 'Vetoed') container.state = 'Vetoed';
        if (event.name === 'Resolved') {
          if (event.args.approved !== undefined) {
            container.state = event.args.approved ? 'Approved' : 'Rejected';
          } else {
            container.state =
              { 4: 'Approved', 3: 'Rejected' }[event.args.ruling.toNumber()] ?? 'Cancelled';
          }
        }
      }
    });
    const nextSnapshot = { events, containers: [...containers.values()], loadedAt: Date.now() };
    if (generation === snapshotGeneration) snapshot = nextSnapshot;
    return nextSnapshot;
  })();
  pendingSnapshot = work;
  try {
    return await work;
  } finally {
    if (pendingSnapshot === work) pendingSnapshot = undefined;
  }
}

export async function fetchOnchainContainers(): Promise<ContainerModel[]> {
  return (await loadSnapshot()).containers;
}

export async function fetchOnchainQueue(quest: { address?: string; version?: number }) {
  const address = await getOnchainQueueAddress(quest);
  const [nonce, events] = await Promise.all([
    queueContract(address).nonce() as Promise<BigNumber>,
    loadSnapshot().then((result) => result.events),
  ]);
  const lastConfig = [...events]
    .reverse()
    .find(
      (event) =>
        event.name === 'Configured' && event.address.toLowerCase() === address.toLowerCase(),
    );
  if (!lastConfig) throw new Error(`Queue ${address} has no Configured event`);
  return { nonce: nonce.toNumber(), config: await mapConfig(lastConfig.args.config) };
}

export async function getOnchainQueueAddress(quest: { address?: string; version?: number }) {
  if (!quest.address) throw new Error('Quest address is required to find its Govern queue');
  const governAddress = await getQuestContract(quest).aragonGovernAddress();
  const govern = new Contract(governAddress, governAbi, provider());
  const roles = await Promise.all(QUEUES.map(({ address }) => govern.roles(EXEC_ROLE, address)));
  const queue = QUEUES.find((_, index) => roles[index].toLowerCase() !== ZERO.toLowerCase());
  if (!queue) throw new Error(`No Govern queue has the exec role on ${governAddress}`);
  return queue.address;
}

export async function fetchOnchainChallenge(containerId: string, queueAddress?: string) {
  const { events } = await loadSnapshot();
  const matching = events.filter(
    (event) =>
      event.name === 'Challenged' &&
      event.args.containerHash.toLowerCase() === containerId.toLowerCase() &&
      (!queueAddress || event.address.toLowerCase() === queueAddress.toLowerCase()),
  );
  const event = matching[matching.length - 1];
  if (!event) return null;
  const block = await provider().getBlock(event.blockNumber);
  return {
    disputeId: event.args.resolverId.toNumber(),
    reason: event.args.reason,
    createdAt: block.timestamp,
    resolver: (await fetchOnchainQueueByAddress(event)).resolver,
    challenger: event.args.actor,
    collateral: await tokenAmount(event.args.collateral),
  };
}

async function fetchOnchainQueueByAddress(atEvent: QueueEvent): Promise<ConfigModel> {
  const { events } = await loadSnapshot();
  const event = [...events]
    .reverse()
    .find(
      (item) =>
        item.name === 'Configured' &&
        item.address.toLowerCase() === atEvent.address.toLowerCase() &&
        (item.blockNumber < atEvent.blockNumber ||
          (item.blockNumber === atEvent.blockNumber && item.logIndex < atEvent.logIndex)),
    );
  if (!event) throw new Error(`Queue ${atEvent.address} has no Configured event`);
  return mapConfig(event.args.config);
}

export async function fetchOnchainVetoReason(containerId: string) {
  const { events } = await loadSnapshot();
  const event = [...events]
    .reverse()
    .find(
      (item) =>
        item.name === 'Vetoed' &&
        item.args.containerHash.toLowerCase() === containerId.toLowerCase(),
    );
  return event?.args.reason as string | undefined;
}
