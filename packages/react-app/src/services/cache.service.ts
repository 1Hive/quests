import { BigNumber, ethers } from 'ethers';
import { QuestModel } from 'src/models/quest.model';
import { TokenModel } from 'src/models/token.model';
import { getNetwork } from 'src/networks';
import { sleep } from 'src/utils/common.util';
import { ONE_HOUR_IN_MS } from 'src/utils/date.utils';
import { Logger } from 'src/utils/logger';
import request from 'graphql-request';
import { getQuestContract } from 'src/utils/contract.util';
import { GovernEntity } from 'src/queries/govern-queue-entity.query';
import { fetchRoutePairWithStable } from './uniswap.service';

const cacheVersion = 2;
let cacheActivated = true;

let cacheMap: Map<
  string,
  Map<string, { value: any; expirationMs?: number } | null>
> = retrieveCache();

// #region Cache definitions

export async function cacheFetchTokenPrice(token: TokenModel, forceCacheRefresh: boolean = false) {
  const price = await buildCache<string | undefined>(
    'token-price',
    token.token,
    () => fetchRoutePairWithStable(token).then((x) => x.price),
    ONE_HOUR_IN_MS / 2, // 30 min
    forceCacheRefresh,
  );
  return price === undefined ? undefined : ethers.utils.parseEther(price);
}

export async function cacheFetchBalance(
  token: TokenModel,
  address: string,
  erc20Contract: ethers.Contract,
  forceCacheRefresh: boolean = false,
) {
  const balance = await buildCache<string>(
    'balance',
    token.token + address,
    () => erc20Contract.balanceOf(address).then((x: BigNumber) => x.toString()),
    30 * 1000, // 30 sec
    forceCacheRefresh,
  );
  return BigNumber.from(balance.toString());
}

export async function cacheTokenInfo(
  address: string,
  erc20Contract: ethers.Contract,
  forceCacheRefresh: boolean = false,
) {
  return buildCache<{ name: string; decimals: number; symbol: string }>(
    'token-info',
    address,
    async () => ({
      name: await erc20Contract.name(),
      decimals: await erc20Contract.decimals(),
      symbol: await erc20Contract.symbol(),
    }),
    undefined,
    forceCacheRefresh,
  );
}

export async function cacheGovernQueueAddressForQuest(
  questData: QuestModel,
  forceCacheRefresh: boolean = false,
) {
  return buildCache<string>(
    'queue-address-for-quest',
    questData.address,
    async () => {
      // Retrieve governAddress from Quest contract
      const quest = getQuestContract(questData.address!);
      const governAddress = await quest.aragonGovernAddress();

      // Fetch who have the exec role for this govern (who being the bound governQueue)
      const { governSubgraph } = getNetwork();
      const result = await request(governSubgraph, GovernEntity, {
        id: governAddress.toLowerCase(),
      });
      return result.govern.roles.find((gov: any) => gov.selector === '0xc2d85afc').who as string;
    },
    undefined,
    forceCacheRefresh,
  );
}

// #endregion

// #region Cache helpers

async function buildCache<TValue>(
  cacheId: string,
  valueId: string | undefined,
  fetchValue: () => Promise<TValue>,
  cacheDurationMs?: number, // Undefined for permanent cache
  forceCacheRefresh?: boolean,
): Promise<TValue> {
  if (!cacheActivated) {
    const value = await fetchValue();
    Logger.debug('Skiping cache', {
      cacheId,
      valueId,
      value,
    });
    return value;
  }
  if (!cacheMap) {
    cacheMap = retrieveCache();
  }
  let cache = cacheMap.get(cacheId);
  if (!cache) {
    cache = new Map<string, { value: TValue; expirationMs: number } | null>();
    cacheMap.set(cacheId, cache);
  } else if (valueId) {
    let cached = cache.get(valueId); // Will set cache to undefined if valueId is undefined
    if (cached !== undefined) {
      // Token is being fetched
      let retryCount = 20;
      while (cached === null) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(200);
        cached = cache.get(valueId);
        retryCount -= 1;
        if (retryCount <= 0) {
          Logger.debug(`Failed to retrieve cache item, reseting cache ${cacheId}`);
          resetCache(cacheId);
          break;
        }
      }
      if (
        cached &&
        (!cached.expirationMs || cached.expirationMs > Date.now()) &&
        !forceCacheRefresh
      ) {
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

  if (valueId) {
    cache.set(valueId, null); // Set to null to indicate that it is being fetched
  }
  const value = await fetchValue();
  if (!valueId) {
    // Only build the cache if the valueId is defined
    Logger.debug('Skiping caching result because valueId is not defined', {
      cacheId,
      valueId,
      value,
      cacheDurationMs,
    });
    return value;
  }
  cache.set(valueId, {
    value,
    expirationMs: cacheDurationMs ? Date.now() + cacheDurationMs : undefined,
  });
  Logger.debug('Building cached version of', { cacheId, valueId, value, cacheDurationMs });
  saveCache(); // Save cache without waiting for it to be saved
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

function saveCache() {
  const { networkId } = getNetwork();
  localStorage.setItem(`${networkId}.cache`, JSON.stringify({ cacheVersion, cacheMap }, replacer));
}

function retrieveCache() {
  const { networkId } = getNetwork();
  const cacheId = `${networkId}.cache`;

  // Clear old cache
  Object.keys(localStorage).forEach((key) => {
    if (key.includes(`cache`) && !key.endsWith(`.cache`)) {
      localStorage.removeItem(key);
    }
  });

  try {
    const cacheJson = localStorage.getItem(cacheId);
    if (cacheJson) {
      const result = JSON.parse(cacheJson, reviver) as {
        cacheVersion: number;
        cacheMap: Map<string, Map<string, any>>;
      };
      if (result.cacheVersion !== cacheVersion) {
        Logger.debug('Cache version mismatch, clearing cache');
        localStorage.removeItem(cacheId);
      } else if (result.cacheMap.size > 0) {
        return result.cacheMap;
      }
    }
  } catch (error) {
    Logger.debug('Error retrieving cache from storage, clearing cache', error);
    localStorage.removeItem(cacheId);
  }

  return new Map<string, Map<string, any>>();
}

function resetCache(cacheId?: string) {
  if (cacheId) {
    cacheMap.get(cacheId)?.clear();
  } else {
    cacheMap.clear();
  }
  saveCache();
  return 'Cache reset';
}

function disableCache() {
  cacheActivated = false;
  return 'Cache disabled';
}

(window as any).resetCache = resetCache;
(window as any).disableCache = disableCache;

// #endregion
