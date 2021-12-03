import { TokenAmount } from './token-amount';

export type QuestData = {
  title?: string;
  description?: string;
  address: string;
  bounty: TokenAmount;
  claimDeposit: TokenAmount;
  expireTimeMs: number;
  rewardTokenAddress: string;
  fallbackAddress?: string;
  isLoading?: boolean;
};
