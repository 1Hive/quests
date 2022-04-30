import { ContainerModel } from './govern.model';
import { TokenAmountModel } from './token-amount.model';

export type ClaimModel = {
  questAddress: string;
  playerAddress: string;
  claimedAmount: TokenAmountModel;
  evidence?: string;
  evidenceIpfsHash?: string;
  claimAll?: boolean;

  // Only set when fetch
  executionTimeMs?: number;
  state?: string;
  container?: ContainerModel;
};
