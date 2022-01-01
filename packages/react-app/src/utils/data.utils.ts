import { TokenModel } from 'src/models/token.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { FundModel } from 'src/models/fund.model';
import { TOKENS } from '../constants';
import { Logger } from './logger';
import { fromBigNumber } from './web3.utils';

export async function convertTo(from: TokenAmountModel, toToken: TokenModel) {
  const { defaultToken } = getNetwork();
  if (!from?.token) {
    from.token = defaultToken;
  }
  const res = await fetch(
    `https://coingecko.p.rapidapi.com/simple/price?ids=${[
      from.token!.symbol,
      toToken.symbol,
    ]}&vs_currencies=usd`,
    {
      method: 'GET',
    },
  );

  Logger.debug(res);
  return { amount: res, token: toToken };
}

export async function computeTotalFunds(funds: FundModel[]) {
  if (!funds?.length) return { amount: 0, token: TOKENS.Theter };
  Logger.debug(funds);
  const tetherFunds = await Promise.all(funds.map((x) => convertTo(x.amount, TOKENS.Theter)));
  // @ts-ignore
  const amount = tetherFunds.reduce((total, x) => total + x.amount);
  return { amount, token: TOKENS.Theter };
}

export function toTokenAmountModel(tokenModel: TokenModel) {
  return {
    parsedAmount: fromBigNumber(tokenModel.amount, tokenModel.decimals),
    token: tokenModel,
  } as TokenAmountModel;
}
