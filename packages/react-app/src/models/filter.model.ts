import { TokenAmountModel } from './token-amount.model';

export type FilterModel = {
  title: string;
  description: string;
  expire: { start?: Date; end?: Date };
  bounty?: TokenAmountModel;
  status: string;
};
