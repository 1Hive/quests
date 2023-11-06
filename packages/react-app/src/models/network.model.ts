import { TokenModel } from './token.model';

export type NetworkModel = {
  networkId: 'rinkeby' | 'goerli' | 'xdai' | 'polygon' | 'mainnet' | 'local';
  chainId: number;
  name: string;
  explorer: 'etherscan' | 'blockscout' | 'polygonscan' | 'gnosisscan';
  questsSubgraph: string;
  governSubgraph: string;
  celesteSubgraph?: string;
  tokenPairSubgraph: string;
  questFactoryAddress: string;
  celesteAddress: string;
  managerAddress?: string;
  rpcUri: string;
  rpcKeyEnvName?: string;
  isTestNetwork: boolean;
  stableTokens: TokenModel[];
  isDeprecated?: boolean;
  blackListedTokens: string[];
};

export type StagingNetworkModel = Partial<NetworkModel> & {
  stagingOf: string;
};
