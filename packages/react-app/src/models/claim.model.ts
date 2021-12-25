import { TokenAmountModel } from './token-amount.model';

export type ClaimModel = {
  questAddress: string;
  playerAddress: string;
  claimAmount: TokenAmountModel;
  evidence: string;
  challengeDeposit?: TokenAmountModel; // Only set when fetching claims
};
