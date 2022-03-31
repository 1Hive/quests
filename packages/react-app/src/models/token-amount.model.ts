import { TokenModel } from './token.model';

export type TokenAmountModel = {
  parsedAmount: number;
  parsedAmountStable?: number; // maybe create new type to handle it or use with PairModel
  token: TokenModel;
};
