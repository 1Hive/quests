import { QuestState } from 'src/constants';
import { TokenAmountModel } from './token-amount.model';

export type FilterModel = {
  title: string;
  description: string;
  minExpireTime?: Date | null;
  bounty?: TokenAmountModel;
  status: QuestState;
};
