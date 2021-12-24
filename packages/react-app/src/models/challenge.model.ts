import { ClaimModel } from './claim.model';

export type ChallengeModel = {
  claim: ClaimModel;
  reason?: string;
};
