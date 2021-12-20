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
  rewardTokenAddress?: string;
  detailsRefIpfs?: string;
  creatorAddress?: string;
};
