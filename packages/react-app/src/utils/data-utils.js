import { TOKENS } from '../constants';

export async function convertTo(from, toToken) {
  const res = await fetch(
    `https://coingecko.p.rapidapi.com/simple/price?ids=${[
      from.token.symb,
      toToken.symb,
    ]}&vs_currencies=usd`,
    {
      method: 'GET',
    },
  );

  console.log(res);
  return { amount: res, token: toToken };
}

export async function computeTotalFunds(funds) {
  if (!funds?.length) return { amount: 0, token: TOKENS.theter };
  console.log(funds);
  const tetherFunds = await Promise.all(funds.map((x) => convertTo(x.amount, TOKENS.theter)));
  const amount = tetherFunds.reduce((total, x) => total + x.amount);
  return { amount, token: TOKENS.theter };
}
