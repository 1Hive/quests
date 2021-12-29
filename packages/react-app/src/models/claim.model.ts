import { TokenAmountModel } from './token-amount.model';

export type ClaimModel = {
  questAddress: string;
  playerAddress: string;
  claimedAmount: TokenAmountModel;
  evidence: string;
  executionTime?: number;
  state?: string;
  challengeDeposit?: TokenAmountModel; // Only set when fetching claims
};
