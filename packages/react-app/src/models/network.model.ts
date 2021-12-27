import { TokenModel } from './token.model';

export type NetworkModel = {
  chainId: number;
  name: string;
  type: string;
  defaultEthNode: string;
  questSubgraph: string;
  governSubgraph: string;
  questFactory: string;
  govern: string;
  governQueue: string;
  celeste: string;
  defaultToken: TokenModel;
  nativeToken: TokenModel;
  ensRegistry?: string;
};
