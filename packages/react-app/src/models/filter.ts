import { TokenAmount } from './token-amount';

export type Filter = {
  address: string;
  title: string;
  description: string;
  expire: { start?: Date; end?: Date };
  bounty: TokenAmount;
};
