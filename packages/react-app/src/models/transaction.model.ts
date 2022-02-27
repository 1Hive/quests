export class TransactionModel {
  hash?: string;

  id!: string;

  pendingMessage?: string;

  estimatedDuration?: number;

  status?: string;

  progress?: number;
}
