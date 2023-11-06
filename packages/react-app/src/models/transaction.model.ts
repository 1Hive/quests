import { TransactionType } from 'src/enums/transaction-type.enum';

export type TransactionModel = {
  hash?: string;
  modalId: string;
  message?: string;
  status: string;
  progress?: number;
  args?: {
    questAddress?: string;
    containerId?: string;
    disputeState?: number;
    players?: string[];
  };
  type: TransactionType;
};
