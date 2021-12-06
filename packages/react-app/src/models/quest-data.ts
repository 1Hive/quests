import { TokenAmount } from './token-amount';

export type QuestData = {
  // User defined
  title?: string;
  description?: string;
  expireTimeMs: number;
  fallbackAddress?: string;
  bounty?: TokenAmount;

  // Computed
  address?: string;
  rewardTokenAddress?: string;
  claimDeposit?: TokenAmount;
  creatorAddress?: string;
};
