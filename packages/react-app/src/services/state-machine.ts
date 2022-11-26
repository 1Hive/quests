import { QuestStatus } from 'src/enums/quest-status.enum';
import { QuestModel } from 'src/models/quest.model';

export function isQuestExpired(quest: QuestModel) {
  return quest.expireTime.getTime() <= Date.now();
}

export function processQuestState(quest: QuestModel, isDepositReleased: boolean) {
  quest.status = QuestStatus.Active;
  if (isQuestExpired(quest)) {
    quest.status =
      quest.bounty?.parsedAmount || (quest.createDeposit && !isDepositReleased)
        ? QuestStatus.Expired
        : QuestStatus.Archived;
  }
  return quest;
}
