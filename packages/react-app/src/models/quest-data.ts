import { Fund } from './fund';
import { Status } from './status';
import { TokenAmount } from './token-amount';

export type QuestData = {
  // Meta
  title?: string;
  description?: string;
  bounty: TokenAmount;
  collateralPercentage: number;
  expireTimeMs: number;
  tags: string[];
  address?: string;
  creatorAddress?: string;
  rewardTokenAddress?: string;
  fallbackAddress?: string;
  players?: string[];
  funds?: Fund[];
  status?: Status;
  isLoading?: boolean;
};
