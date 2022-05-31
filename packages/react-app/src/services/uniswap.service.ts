import { request } from 'graphql-request';
import { PairModel } from 'src/models/uniswap.model';
import { getNetwork } from 'src/networks';
import { UniswapPairsEntityQuery } from 'src/queries/uniswap-pairs-entity.query';
import { arrayDistinct } from 'src/utils/array.util';
import { Route, Trade, Pair } from '@uniswap/v2-sdk';
import { Token, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { TokenModel } from 'src/models/token.model';
import { getUniswapPairContract } from 'src/utils/contract.util';
import { Logger } from '../utils/logger';

// #region Private
function mapPair(pairEntity: any) {
  if (!pairEntity) return undefined;
  try {
    const quest = { ...pairEntity } as PairModel;
    return quest;
  } catch (error) {
    Logger.exception(error, `Failed to map pair :\n${JSON.stringify(pairEntity)}`);
    return undefined;
  }
}

function mapPairList(pairs: any[]): Promise<PairModel[]> {
  return Promise.all(pairs.map(mapPair).filter((pair) => !!pair)) as Promise<PairModel[]>; // Filter out undefined quests (skiped)
}

// #endregion

// #region Subgraph Queries

export async function fetchPairWithStables(tokenA: TokenModel): Promise<PairModel[] | undefined> {
  const { tokenPairSubgraph, stableTokens } = getNetwork();
  if (!tokenPairSubgraph) return undefined;

  const queryResult = await request(tokenPairSubgraph, UniswapPairsEntityQuery, {
    tokenA: tokenA.token.toLowerCase(), // Subgraph address are stored lowercase
    tokenBArray: arrayDistinct(stableTokens).map((token) => token.token.toLowerCase()),
  });
  return mapPairList(queryResult.pairs);
}
// #endregion

// #region Contract Queries

export async function fetchRoutePairWithStable(tokenA: TokenModel) {
  const { chainId, isTestNetwork } = getNetwork();
  const PRICE_ZERO = Promise.resolve({ price: isTestNetwork ? '1' : '0' }); // Fallback to 1 for dev or 0 for production
  try {
    const pairsWithStables = await fetchPairWithStables(tokenA);

    if (!pairsWithStables || pairsWithStables.length === 0) {
      throw new Error('Token dont have pair with stables knowed');
    }

    const firstPair = pairsWithStables[0];

    if (!firstPair.token1) {
      throw new Error('Stable token not defined');
    }

    const { token: commonStable, decimals, symbol, name } = firstPair.token1;

    if (!commonStable) {
      throw new Error('Token common Stable not found: dont have pair with stables knowed');
    }

    const tokenAObj = new Token(chainId, tokenA.token, tokenA.decimals, tokenA.symbol, tokenA.name);
    const tokenStableObj = new Token(chainId, commonStable, +decimals, symbol, name);

    const pairAddress = Pair.getAddress(tokenAObj, tokenStableObj);
    const contract = getUniswapPairContract(pairAddress);
    const reserves = await contract.getReserves();
    const token0Address = await contract.token0();
    const token1Address = await contract.token1();
    const token0 = [tokenAObj, tokenStableObj].find((token) => token.address === token0Address);
    const token1 = [tokenAObj, tokenStableObj].find((token) => token.address === token1Address);

    if (!token0 || !token1) {
      throw new Error('Token0 and Token1 are different from initial pair informed');
    }

    const pair = new Pair(
      CurrencyAmount.fromRawAmount(token0, reserves.reserve0.toString()),
      CurrencyAmount.fromRawAmount(token1, reserves.reserve1.toString()),
    );

    const route = new Route([pair], tokenAObj, tokenStableObj);

    const tokenAmount = CurrencyAmount.fromRawAmount(tokenAObj, '1000000000000000000');
    const trade = new Trade(route, tokenAmount, TradeType.EXACT_INPUT);
    return {
      price: trade.executionPrice.toSignificant(6),
    };
  } catch (error) {
    Logger.warn('warning - fetchRoutePairWithStable:', error);
    return PRICE_ZERO;
  }
}

// #endregion
