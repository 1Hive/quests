import { ContainerModel } from './govern.model';
import { TokenAmountModel } from './token-amount.model';

export type ClaimModel = {
  questAddress: string;
  playerAddress: string;
  claimedAmount: TokenAmountModel;
  evidence: string;
  executionTimeMs?: number;
  state?: string;
  container?: ContainerModel; // Only set when fetch
};
