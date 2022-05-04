import { ENUM_QUEST_STATE } from 'src/constants';
import { QuestModel } from 'src/models/quest.model';

export function isQuestExpired(quest: QuestModel) {
  return quest.expireTime.getTime() <= Date.now();
}

export function processQuestState(quest: QuestModel, isDepositReleased: boolean) {
  quest.state = ENUM_QUEST_STATE.Active;
  if (isQuestExpired(quest)) {
    quest.state =
      quest.bounty?.parsedAmount || (quest.deposit && !isDepositReleased)
        ? ENUM_QUEST_STATE.Expired
        : ENUM_QUEST_STATE.Archived;
  }
  return quest;
}
