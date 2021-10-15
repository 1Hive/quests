import { QuestCreated } from "../generated/QuestFactory/QuestFactory";
import { QuestEntity } from "../generated/schema";

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());
  questEntity.questAddress = event.params.questAddress;
  questEntity.questMetadataHash = event.params.requirementsIpfsHash;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTime = event.params.expireTime;
  questEntity.questVersion = event.params.version;
  questEntity.save();
}
