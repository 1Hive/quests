import { ContainerEventResolve } from "../generated/schema";

import { Resolved as ResolvedEvent } from "../generated/GovernQueueV3/GovernQueue";

import { buildEventHandlerId } from "./utils/ids";
import { finalizeContainerEvent } from "./utils/events";
import {
  APPROVED_STATUS,
  REJECTED_STATUS,
  CANCELLED_STATUS,
} from "./utils/constants";

import { loadOrCreateContainer } from "./GovernQueue";

export * from "./GovernQueueV2";

export function handleResolved(event: ResolvedEvent): void {
  let container = loadOrCreateContainer(
    event.params.containerHash,
    event.address.toHex()
  );

  if (event.params.ruling.toI32() == 4) {
    container.state = APPROVED_STATUS;
  } else if (event.params.ruling.toI32() == 3) {
    container.state = REJECTED_STATUS;
  } else {
    container.state = CANCELLED_STATUS;
  }

  let eventId = buildEventHandlerId(
    container.id,
    "resolve",
    event.transactionLogIndex.toHexString()
  );

  let containerEvent = new ContainerEventResolve(eventId);
  containerEvent.ruling = event.params.ruling.toI32();

  finalizeContainerEvent<ResolvedEvent, ContainerEventResolve>(
    container,
    containerEvent,
    event
  );

  container.save();
}
