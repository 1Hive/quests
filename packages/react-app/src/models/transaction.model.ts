export type TransactionType =
  | 'TokenApproval'
  | 'QuestCreate'
  | 'QuestFund'
  | 'QuestReclaimFunds'
  | 'QuestPlay'
  | 'QuestLeave'
  | 'ClaimSchedule'
  | 'ClaimExecute'
  | 'ClaimVeto'
  | 'ClaimChallenge'
  | 'ClaimChallengeResolve';

export type TransactionModel = {
  hash?: string;
  modalId: string;
  message?: string;
  estimatedDuration?: number;
  status: string;
  progress?: number;
  args?: {
    questAddress?: string;
    containerId?: string;
    disputeState?: number;
    player?: string;
  };
  type: TransactionType;
};
