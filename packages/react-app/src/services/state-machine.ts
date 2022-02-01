import { ENUM_QUEST_STATE } from 'src/constants';
import { QuestModel } from 'src/models/quest.model';

export function processQuestState(quest: QuestModel) {
  quest.state = ENUM_QUEST_STATE.Active;
  if (quest.expireTime.getTime() <= Date.now()) {
    quest.state = quest.bounty?.parsedAmount ? ENUM_QUEST_STATE.Expired : ENUM_QUEST_STATE.Archived;
  }
  return quest;
}
