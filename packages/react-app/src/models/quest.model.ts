import { TokenModel } from './token.model';
import { TokenAmountModel } from './token-amount.model';

export type QuestModel = {
  // User defined
  title?: string;
  description?: string;
  expireTime: Date;
  fallbackAddress?: string;

  // Computed
  creationTime?: Date;
  address?: string;
  bounty?: TokenAmountModel;
  rewardToken?: TokenModel | string;
  detailsRefIpfs?: string;
  creatorAddress?: string;
  state: string;
};
