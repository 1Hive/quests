import { TokenModel } from './token.model';

export type NetworkModel = {
  chainId: number;
  name: string;
  type: string;
  explorerBase: string;
  defaultEthNode: string;
  questSubgraph: string;
  governSubgraph: string;
  celesteSubgraph: string;
  questFactoryAddress: string;
  governAddress: string;
  governQueueAddress: string;
  celesteAddress: string;
  defaultToken: TokenModel;
  nativeToken: TokenModel;
  ensRegistry?: string;
  isTestNetwork: boolean;
  defaultGazFees: {
    gasLimit: number;
    gasPrice: number;
  };
};
