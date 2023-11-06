/* eslint-disable no-unused-vars */
export enum DisputeStatus {
  NotDisputed = 0,
  Disputed = 1,
  DisputeNotRuledOrAbstainFromVoting = 2, // Could be used when Abstain from voting state
  DisputeRuledForChallenger = 3,
  DisputeRuledForSubmitter = 4,
}
