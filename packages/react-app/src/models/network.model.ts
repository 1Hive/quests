import { TokenModel } from './token.model';

export type NetworkModel = {
  networkId: 'rinkeby' | 'gnosis';
  chainId: number;
  name: string;
  explorerBase: string;
  questsSubgraph: string;
  governSubgraph: string;
  uniswapSubgraph: string;
  questFactoryAddress: string;
  governAddress: string;
  governQueueAddress: string;
  celesteAddress: string;
  httpProvider: string;
  isTestNetwork: boolean;
  stableTokens: TokenModel[];
};
