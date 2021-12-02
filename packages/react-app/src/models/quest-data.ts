import { Fund } from './fund';
import { TokenAmount } from './token-amount';

export type QuestData = {
  // Meta
  title?: string;
  description?: string;
  address: string;
  bounty: TokenAmount;
  claimDeposit: TokenAmount;
  expireTimeMs: number;

  creatorAddress?: string;
  rewardTokenAddress?: string;
  fallbackAddress?: string;
  players?: string[];
  funds?: Fund[];
  isLoading?: boolean;
};
