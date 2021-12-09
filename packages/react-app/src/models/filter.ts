import { TokenAmount } from './token-amount';

export type Filter = {
  search: string;
  expire: { start?: Date; end?: Date };
  bounty: TokenAmount;
};
