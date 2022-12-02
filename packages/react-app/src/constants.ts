import { Pages } from './enums/pages.enum';
import { QuestStatus } from './enums/quest-status.enum';
import env from './environment';
import { FilterModel } from './models/filter.model';

export const PCT_BASE = BigInt(1e18);

export const APP_TITLE = 'Quests';

// Env
export const DEFAULT_THEME = 'dark';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export const REPO_ADDRESS = 'https://github.com/1Hive/quests/';

// Constants

export const GQL_MAX_INT_MS = (2 ** 31 - 1) * 1000;

export const QUESTS_PAGE_SIZE = 4;

export const EXPECTED_CHAIN_ID = env('FORCE_CHAIN_ID') ? [+env('FORCE_CHAIN_ID')!] : [100, 4, 5];

// Default values

export const DEFAULT_PAGE = Pages.List;

export const DEFAULT_FILTER = Object.freeze({
  address: '',
  title: '',
  description: '',
  minExpireTime: null,
  bounty: undefined,
  status: QuestStatus.Active,
} as FilterModel);

export const DEFAULT_CLAIM_EXECUTION_DELAY_MS = 1 * 60 * 1000; // Add 15 minutes by default

export const MAX_LINE_DESCRIPTION = 5;
