import { BigNumber, ethers } from 'ethers';
import { TokenModel } from 'src/models/token.model';
import { sleep } from 'src/utils/common.util';
import { ONE_HOUR_IN_MS } from 'src/utils/date.utils';
import { Logger } from 'src/utils/logger';
import { fetchRoutePairWithStable } from './uniswap.service';

let cacheMap: Map<
  string,
  Map<string, { value: any; expirationMs?: number } | null>
> = retrieveCache();

export async function cacheFetchTokenPrice(token: TokenModel) {
  const price = await buildCache<string>(
    'token-price',
    token.token,
    () => fetchRoutePairWithStable(token).then((x) => x.price),
    ONE_HOUR_IN_MS / 2, // 30 min
  );
  return ethers.utils.parseEther(price);
}

export async function cacheFetchBalance(
  token: TokenModel,
  address: string,
  erc20Contract: ethers.Contract,
) {
  const balance = await buildCache<string>(
    'balance',
    token.token + address,
    () => erc20Contract.balanceOf(address).then((x: BigNumber) => x.toString()),
    30 * 1000, // 30 sec
  );
  return BigNumber.from(balance.toString());
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
  if (!cacheMap) {
    cacheMap = retrieveCache();
  }
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
  saveCacheAsync(); // Save cache without waiting for it to be saved
  return value;
}

function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }
  return value;
}

function reviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

function saveCacheAsync() {
  localStorage.setItem('cache', JSON.stringify(cacheMap, replacer));
}

function retrieveCache() {
  try {
    const cacheJson = localStorage.getItem('cache');
    if (cacheJson) {
      const map = JSON.parse(cacheJson, reviver) as Map<string, Map<string, any>>;
      if (map.size > 0) {
        return map;
      }
    }
  } catch (error) {
    Logger.debug('Error retrieving cache from storage', error);
  }
  return new Map<string, Map<string, any>>();
}
