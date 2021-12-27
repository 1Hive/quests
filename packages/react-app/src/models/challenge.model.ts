import { ClaimModel } from './claim.model';
import { TokenAmountModel } from './token-amount.model';

export type ChallengeModel = {
  claim: ClaimModel;
  deposit: TokenAmountModel;
  reason?: string;
};
