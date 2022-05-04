import { BigNumber } from 'ethers';

export type DepositModel = {
  token: string;
  amount: BigNumber;
  released: boolean;
};
