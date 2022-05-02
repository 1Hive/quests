export type TransactionModel = {
  hash?: string;
  id: string;
  message?: string;
  estimatedDuration?: number;
  status: string;
  progress?: number;
  questAddress?: string;
  args?: any[];
  type:
    | 'TokenApproval'
    | 'QuestCreate'
    | 'QuestFund'
    | 'QuestReclaimFunds'
    | 'ClaimSchedule'
    | 'ClaimExecute'
    | 'ClaimChallenge'
    | 'ClaimChallengeResolve';
};
