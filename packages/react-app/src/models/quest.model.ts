import { QuestStatus } from 'src/enums/quest-status.enum';
import { FeatureSupportModel } from 'src/services/feature-support.service';
import { TokenModel } from './token.model';
import { TokenAmountModel } from './token-amount.model';
import { DepositModel } from './deposit-model';

export type QuestModel = {
  // User defined
  title?: string;
  description?: string;
  communicationLink?: string;
  expireTime: Date;
  fallbackAddress: string;
  creatorAddress: string;
  maxPlayers?: number;
  unlimited?: boolean;
  isWhitelist: boolean;

  // Loaded from subgraph
  activeClaimCount?: number;
  creationTime?: Date;
  address?: string;
  bounty?: TokenAmountModel | null;
  rewardToken?: TokenModel | string;
  detailsRefIpfs?: string;
  status: QuestStatus;
  createDeposit?: DepositModel;
  playDeposit?: DepositModel;
  players?: string[];
  governAddress?: string;
  version?: number;

  // Feature support
  features: FeatureSupportModel;
};
