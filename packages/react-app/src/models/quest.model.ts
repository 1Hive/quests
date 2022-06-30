import { TokenModel } from './token.model';
import { TokenAmountModel } from './token-amount.model';
import { DepositModel } from './deposit-model';

export type QuestModel = {
  // User defined
  title?: string;
  description?: string;
  expireTime: Date;
  fallbackAddress: string;
  creatorAddress: string;
  // Computed
  activeClaimCount?: number;
  creationTime?: Date;
  address?: string;
  bounty?: TokenAmountModel | null;
  rewardToken?: TokenModel | string;
  detailsRefIpfs?: string;
  state: string;
  deposit?: DepositModel;
};
