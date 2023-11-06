import { QuestStatus } from 'src/enums/quest-status.enum';
import { QuestPlayStatus } from 'src/enums/quest-play-status.enum';
import { TokenAmountModel } from './token-amount.model';

export type FilterModel = {
  search: string;
  minExpireTime?: Date | null;
  bounty?: TokenAmountModel;
  status: QuestStatus;
  playStatus: QuestPlayStatus;
};
