import { TokenModel } from './token.model';

export type TokenAmountModel = {
  parsedAmount: number;
  usdValue?: number; // Only set when fetching from getBalanceOf
  token: TokenModel;
};
