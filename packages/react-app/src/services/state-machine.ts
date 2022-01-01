import { QUEST_STATE } from 'src/constants';
import { QuestModel } from 'src/models/quest.model';

export function processQuestState(quest: QuestModel) {
  quest.state = QUEST_STATE.Active;
  if (quest.expireTimeMs <= Date.now()) {
    quest.state = quest.bounty?.parsedAmount ? QUEST_STATE.Expired : QUEST_STATE.Archived;
  }
  return quest;
}
