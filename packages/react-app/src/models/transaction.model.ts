export class TransactionModel {
  hash!: string;

  pendingMessage?: string;

  estimatedEnd?: number;

  status?: string;

  progress?: number;
}
