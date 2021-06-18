import { QuestCreated } from "../generated/QuestFactory/QuestFactory";
import { QuestFactory } from "../generated/schema";

export function handleQuestCreate(event: QuestCreated): void {
  let questFactory = new QuestFactory(event.params.questAddress.toHex());
  questFactory.questAddress = event.params.questAddress;
  questFactory.questMetadata = event.params._content;

  questFactory.save();
}
