import { TokenModel } from './token.model';

export type PairModel = {
  // User defined
  token0?: TokenModel;
  token1?: TokenModel;
  token1Price: string;
};
