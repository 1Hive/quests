import { TokenModel } from 'src/models/token.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { FundModel } from 'src/models/fund.model';
import { fromBigNumber } from './web3.utils';

export async function convertTo(
  from: TokenAmountModel,
  toToken: TokenModel,
): Promise<TokenAmountModel> {
  const { chainId, name } = getNetwork();
  const baseApi = 'https://api.coingecko.com/api/v3';
  const assetsPlatforms = await fetch(`${baseApi}/asset_platforms`, {
    method: 'GET',
  });
  const networkPlatformId = (await ((await assetsPlatforms.json()) as Promise<any[]>)).find(
    (x) => x.chain_identifier === chainId,
  )?.id;
  if (!networkPlatformId) throw new Error(`${name} network doesn't support asset conversion`);
  const vsCurrency = 'usd';
  const resObj = (
    await fetch(
      `https://coingecko.p.rapidapi.com/simple/token_price/${networkPlatformId}?contract_addresses=${from.token.token},${toToken.token}&vs_currencies=${vsCurrency}`,
      {
        method: 'GET',
      },
    )
  ).json();

  const fromPrice = resObj[from.token.token][vsCurrency];
  const toPrice = resObj[toToken.token][vsCurrency];
  const totalTo = (from.parsedAmount * fromPrice) / toPrice;

  return { parsedAmount: totalTo, token: toToken };
}

export async function computeTotalFunds(funds: FundModel[]) {
  const { stableToken } = getNetwork();

  if (!funds?.length) return { parsedAmount: 0, token: stableToken } as TokenAmountModel;
  const usdFunds = await Promise.all(funds.map((x) => convertTo(x.fundAmount, stableToken)));
  const amount = usdFunds.reduce((total, x) => ({
    parsedAmount: total.parsedAmount + x.parsedAmount,
    token: total.token,
  }));
  return amount;
}

export function toTokenAmountModel(tokenModel: TokenModel) {
  return {
    parsedAmount: fromBigNumber(tokenModel.amount, tokenModel.decimals),
    token: tokenModel,
  } as TokenAmountModel;
}
