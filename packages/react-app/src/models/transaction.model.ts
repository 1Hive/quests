export type TransactionModel = {
  hash?: string;
  id: string;
  message?: string;
  estimatedDuration?: number;
  status: string;
  transactionType:
    | 'QuestCreate'
    | 'QuestFund'
    | 'QuestReclaimFunds'
    | 'ClaimSchedule'
    | 'ClaimExecute'
    | 'ClaimChallenge'
    | 'ClaimChallengeResolve';
};
