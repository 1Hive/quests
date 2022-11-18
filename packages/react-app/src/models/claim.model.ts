import { ClaimState } from 'src/constants';
import { ContainerModel } from './govern.model';
import { TokenAmountModel } from './token-amount.model';

export type ClaimModel = {
  questAddress: string;
  playerAddress: string;
  claimedAmount: TokenAmountModel;
  evidence?: string;
  claimInfoIpfsHash?: string;
  claimAll?: boolean;
  contactInformation?: string;
  // Only set when fetch
  executionTimeMs?: number;
  state?: ClaimState;
  container?: ContainerModel;
};
