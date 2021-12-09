import { Fund } from 'src/models/fund';
import { Token } from 'src/models/token';
import { TokenAmount } from 'src/models/token-amount';
import { TOKENS } from '../constants';
import { Logger } from './logger';

export async function convertTo(from: TokenAmount, toToken: Token) {
  const res = await fetch(
    `https://coingecko.p.rapidapi.com/simple/price?ids=${[
      from.token.symb,
      toToken.symb,
    ]}&vs_currencies=usd`,
    {
      method: 'GET',
    },
  );

  Logger.debug(res);
  return { amount: res, token: toToken };
}

export async function computeTotalFunds(funds: Fund[]) {
  if (!funds?.length) return { amount: 0, token: TOKENS.theter };
  Logger.debug(funds);
  const tetherFunds = await Promise.all(funds.map((x) => convertTo(x.amount, TOKENS.theter)));
  // @ts-ignore
  const amount = tetherFunds.reduce((total, x) => total + x.amount);
  return { amount, token: TOKENS.theter };
}
