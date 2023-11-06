import { Scheduled as ScheduledEvent } from "../generated/GovernQueueV2/GovernQueue";
import { Scheduled as ScheduledEventV1 } from "../generated/GovernQueue/GovernQueue";
import { handleScheduled as handleScheduledV1 } from "./GovernQueue";

export * from "./GovernQueue";

export function handleScheduled(event: ScheduledEvent): void {
  const scheduledEventV1 = new ScheduledEventV1(
    event.address,
    event.logIndex,
    event.transactionLogIndex,
    event.logType,
    event.block,
    event.transaction,
    event.parameters,
    event.receipt
  );
  // Just ignore the challenger field withc isn't used
  handleScheduledV1(scheduledEventV1);
}
