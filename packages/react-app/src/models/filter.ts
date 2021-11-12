import { TokenAmount } from './token-amount';

export type Filter = {
  search: string;
  expire: { start?: Date; end?: Date };
  tags: string[];
  bounty: TokenAmount;
  showFull: boolean;
  foundedQuests: boolean;
  playedQuests: boolean;
  createdQuests: boolean;
};
