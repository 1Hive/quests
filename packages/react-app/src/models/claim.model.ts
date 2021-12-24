import { TokenAmountModel } from './token-amount.model';

export type ClaimModel = {
  questAddress: string;
  playerAddress: string;
  claimAmount: TokenAmountModel;
  evidence: string;
};
