import { Token } from './token';
import { TokenAmount } from './token-amount';

export type QuestData = {
  // User defined
  title?: string;
  description?: string;
  expireTimeMs: number;
  fallbackAddress?: string;

  // Computed
  address?: string;
  bounty?: TokenAmount;
  rewardToken?: Token;
  detailsRefIpfs?: string;
  creatorAddress?: string;
};
