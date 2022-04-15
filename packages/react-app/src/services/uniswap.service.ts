import { request } from 'graphql-request';
import { PairModel } from 'src/models/uniswap.model';
import { getNetwork } from 'src/networks';
import { UniswapPairsEntityQuery } from 'src/queries/uniswap-pairs-entity.query';
import { TOKENS } from 'src/constants';
import { arrayDistinct } from 'src/utils/array.util';
import Web3 from 'web3';
import { getDefaultProvider } from 'src/utils/web3.utils';
import { Route, Trade, Pair } from '@uniswap/v2-sdk';
import { Token, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { ethers } from 'ethers';
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

export async function fetchPairWithStables(tokenA: string): Promise<PairModel[] | undefined> {
  const { uniswapSubgraph } = getNetwork();
  if (!uniswapSubgraph) return undefined;

  const queryResult = await request(uniswapSubgraph, UniswapPairsEntityQuery, {
    tokenA: tokenA.toLowerCase(), // Subgraph address are stored lowercase
    tokenBArray: arrayDistinct([
      // Some stables address should be here
      TOKENS.RinkebyDai.token,
      TOKENS.RinkebyHoney.token,
      TOKENS.RinkebyTheter.token,
      '0x531eab8bb6a2359fe52ca5d308d85776549a0af9',
      '0xd92e713d051c37ebb2561803a3b5fbabc4962431',
      '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
      '0x8ad45fe3869fd7e414f7851ccf95f24b1ecd344b',
      '0xab0733588776b8881f7712f6abca98f510e6b63d',
      '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
      '0x531eab8bb6a2359fe52ca5d308d85776549a0af9',
    ]).map((token) => token.toLowerCase()),
  });
  return mapPairList(queryResult.pairs);
}
// #endregion

// #region Contract Queries

export async function fetchRoutePairWithStable(tokenA: string) {
  const { chainId, isTestNetwork } = getNetwork();
  const PRICE_ZERO = Promise.resolve({ price: isTestNetwork ? '1' : '0' }); // Fallback to 1 for dev or 0 for production

  try {
    tokenA = Web3.utils.toChecksumAddress(tokenA);

    const pairsWithStables = await fetchPairWithStables(tokenA);

    if (!pairsWithStables || pairsWithStables.length === 0) {
      throw new Error('Token dont have pair with stables knowed');
    }

    if (!pairsWithStables[0].token1) {
      throw new Error('Stable token not defined');
    }

    const { token: commonStable, name, symbol, decimals } = pairsWithStables[0].token1;

    if (!commonStable) {
      throw new Error('Token common Stable not found: dont have pair with stables knowed');
    }

    const provider = getDefaultProvider();

    const tokenAObj = new Token(chainId, tokenA, 18, symbol, name); // TODO should use variable decimals here
    const tokenStableObj = new Token(chainId, commonStable, +decimals, symbol, name);

    const pairAddress = Pair.getAddress(tokenAObj, tokenStableObj);

    const contract = new ethers.Contract(
      pairAddress,
      [
        'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
        'function token0() external view returns (address)',
        'function token1() external view returns (address)',
      ],
      provider,
    );
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
    Logger.debug(`warning - fetchRoutePairWithStable: ${error}`);
    return PRICE_ZERO;
  }
}

// #endregion
