export class TransactionModel {
  hash?: string;

  id!: string;

  pendingMessage?: string;

  estimatedEnd?: number;

  status?: string;

  progress?: number;
}
