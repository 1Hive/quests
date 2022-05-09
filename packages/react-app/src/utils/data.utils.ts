import { TokenModel } from 'src/models/token.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { fromBigNumber } from './web3.utils';

export function toTokenAmountModel(tokenModel: TokenModel) {
  return {
    parsedAmount: fromBigNumber(tokenModel.amount, tokenModel.decimals),
    token: tokenModel,
  } as TokenAmountModel;
}
