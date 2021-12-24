import { TokenAmountModel } from './token-amount.model';

export type FundModel = {
  patron: string;
  amount: TokenAmountModel;
};
