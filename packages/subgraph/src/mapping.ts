import { QuestCreated } from "../generated/QuestFactory/QuestFactory";
import { QuestFactory } from "../generated/schema";

export function handleQuestCreate(event: QuestCreated): void {
  let questFactory = new QuestFactory(event.params.questAddress.toHex());
  questFactory.questAddress = event.params.questAddress;
  questFactory.questMetadataHash = event.params.requirementsIpfsHash;
  questFactory.questRewardTokenAddress = event.params.rewardTokenAddress;
  questFactory.questExpireTime = event.params.expireTime;
  questFactory.questVersion = event.params.version;
  questFactory.save();
}
