import { BigNumber, ethers } from 'ethers';
import { TokenModel } from 'src/models/token.model';
import { sleep } from 'src/utils/common.util';
import { fetchRoutePairWithStable } from './uniswap.service';

const tokenPriceMap = new Map<string, BigNumber | null>();

export async function cacheFetchTokenPrice(token: TokenModel) {
  const id = token.token;
  if (tokenPriceMap.has(id)) {
    const tokenPrice = tokenPriceMap.get(id);
    if (tokenPrice) return tokenPrice;
    // Token is being fetched
    while (tokenPriceMap.get(id) === null) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(200);
    }
    return tokenPriceMap.get(id)!;
  }
  tokenPriceMap.set(id, null); // Set to null to indicate that it is being fetched
  const res = await fetchRoutePairWithStable(token);
  const tokenPrice = ethers.utils.parseEther(res.price);
  tokenPriceMap.set(id, tokenPrice);
  return tokenPrice;
}
