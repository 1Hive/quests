import { TokenAmountModel } from './token-amount.model';

export type FilterModel = {
  address: string;
  title: string;
  description: string;
  expire: { start?: Date; end?: Date };
  bounty?: TokenAmountModel;
  status: number;
};
