import { TokenAmountModel } from './token-amount.model';

export type ChallengeModel = {
  deposit: TokenAmountModel;
  reason: string;

  // Set when fetch from subgraph only
  createdAt?: number;
  resolver?: string;
  disputeId?: number;
};
