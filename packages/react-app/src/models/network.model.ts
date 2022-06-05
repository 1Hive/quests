import { TokenModel } from './token.model';

export type NetworkModel = {
  networkId: 'rinkeby' | 'xdai' | 'polygon' | 'mainnet';
  chainId: number;
  name: string;
  explorerBase: string;
  questsSubgraph: string;
  governSubgraph: string;
  tokenPairSubgraph: string;
  questFactoryAddress: string;
  governQueueAddress: string;
  celesteAddress: string;
  rpcUri: string;
  rpcKeyEnvName?: string;
  isTestNetwork: boolean;
  stableTokens: TokenModel[];
};
