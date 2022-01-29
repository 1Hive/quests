import { TokenAmountModel } from './token-amount.model';

export type FilterModel = {
  title: string;
  description: string;
  expireTime?: number | null;
  bounty?: TokenAmountModel;
  status: string;
};
