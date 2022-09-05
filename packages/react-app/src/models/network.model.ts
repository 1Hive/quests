import { TokenModel } from './token.model';

export type NetworkModel = {
  networkId: 'rinkeby' | 'xdai' | 'polygon' | 'mainnet' | 'local' | 'goerli';
  chainId: number;
  name: string;
  explorer: string;
  questsSubgraph: string;
  governSubgraph: string;
  tokenPairSubgraph: string;
  questFactoryAddress: string;
  governQueueAddress: string;
  celesteAddress: string;
  managerAddress?: string;
  rpcUri: string;
  rpcKeyEnvName?: string;
  isTestNetwork: boolean;
  stableTokens: TokenModel[];
  nativeToken: TokenModel;
};
