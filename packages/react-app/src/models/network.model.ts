import { TokenModel } from './token.model';

export type NetworkModel = {
  networkId: 'rinkeby' | 'goerli' | 'xdai' | 'polygon' | 'mainnet' | 'local';
  chainId: number;
  name: string;
  explorer: string;
  questsSubgraph: string;
  governSubgraph: string;
  tokenPairSubgraph: string;
  questFactoryAddress: string;
  celesteAddress: string;
  managerAddress?: string;
  rpcUri: string;
  rpcKeyEnvName?: string;
  isTestNetwork: boolean;
  stableTokens: TokenModel[];
  isDeprecated?: boolean;
};
