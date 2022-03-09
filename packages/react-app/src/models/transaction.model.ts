export class TransactionModel {
  hash?: string;

  id!: string;

  message?: string;

  estimatedDuration?: number;

  status?: string;

  progress?: number;
}
