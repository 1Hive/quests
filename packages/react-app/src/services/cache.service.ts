import { BigNumber, Contract, ethers } from 'ethers';
import { TokenModel } from 'src/models/token.model';
import { sleep } from 'src/utils/common.util';
import { getProviderOrSigner } from 'src/utils/contract.util';
import { ONE_HOUR_IN_MS } from 'src/utils/date.utils';
import { Logger } from 'src/utils/logger';
import { fetchRoutePairWithStable } from './uniswap.service';

const cacheMap = new Map<string, Map<string, { value: any; expirationMs?: number } | null>>();

export async function cacheFetchTokenPrice(token: TokenModel) {
  return buildCache<BigNumber>(
    'token-price',
    token.token,
    () => fetchRoutePairWithStable(token).then((x) => ethers.utils.parseEther(x.price)),
    ONE_HOUR_IN_MS / 2, // 30 min
  );
}

export async function cacheFetchBalance(
  token: TokenModel,
  address: string,
  erc20Contract: ethers.Contract,
) {
  return buildCache<BigNumber>(
    'balance',
    token.token + address,
    () => erc20Contract.balanceOf(address),
    30 * 1000, // 30 sec
  );
}

export async function cacheTokenInfo(address: string, erc20Contract: ethers.Contract) {
  return buildCache<{ name: string; decimals: number; symbol: string }>(
    'token-info',
    address,
    async () => ({
      name: await erc20Contract.name(),
      decimals: await erc20Contract.decimals(),
      symbol: await erc20Contract.symbol(),
    }),
  );
}

async function buildCache<TValue>(
  cacheId: string,
  valueId: string,
  fetchValue: () => Promise<TValue>,
  cacheDurationMs?: number, // Undefined for permanent cache
): Promise<TValue> {
  let cache = cacheMap.get(cacheId);
  if (!cache) {
    cache = new Map<string, { value: TValue; expirationMs: number } | null>();
    cacheMap.set(cacheId, cache);
  } else {
    let cached = cache.get(valueId);
    if (cached !== undefined) {
      // Token is being fetched
      while (cached === null) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(200);
        cached = cache.get(valueId);
      }
      if (cached !== undefined && (!cached.expirationMs || cached.expirationMs > Date.now())) {
        Logger.debug('Using cached version of', {
          cacheId,
          valueId,
          value: cached.value,
          cacheDurationMs,
        });
        return cached.value;
      }
    }
  }
  cache.set(valueId, null); // Set to null to indicate that it is being fetched
  const value = await fetchValue();
  cache.set(valueId, {
    value,
    expirationMs: cacheDurationMs ? Date.now() + cacheDurationMs : undefined,
  });
  Logger.debug('Building cached version of', { cacheId, valueId, value, cacheDurationMs });
  return value;
}
