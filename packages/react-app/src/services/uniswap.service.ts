import { request } from 'graphql-request';
import { PairModel } from 'src/models/uniswap.model';
import { getNetwork } from 'src/networks';
import { UniswapPairsEntityQuery } from 'src/queries/uniswap-pairs-entity.query';
import { TOKENS } from 'src/constants';
import { arrayDistinct } from 'src/utils/array.util';
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
  const { uniswapRinkebySubgraph } = getNetwork();
  if (!uniswapRinkebySubgraph) return undefined;

  const queryResult = await request(uniswapRinkebySubgraph, UniswapPairsEntityQuery, {
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
