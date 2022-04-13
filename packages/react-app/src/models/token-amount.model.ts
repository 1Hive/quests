import { BigNumber } from 'ethers';
import { TokenModel } from './token.model';

export type TokenAmountModel = {
  parsedAmount: number;
  usdValue?: BigNumber; // Only set when fetching from getBalanceOf
  token: TokenModel;
};
