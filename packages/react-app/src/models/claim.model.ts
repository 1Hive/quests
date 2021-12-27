import { TokenAmountModel } from './token-amount.model';

export type ClaimModel = {
  questAddress: string;
  playerAddress: string;
  claimAmount: TokenAmountModel;
  evidence: string;
  executionTime?: number;
  challengeDeposit?: TokenAmountModel; // Only set when fetching claims
};
