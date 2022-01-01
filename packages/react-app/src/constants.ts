import { FilterModel } from './models/filter.model';
import { TokenAmountModel } from './models/token-amount.model';
import { TokenModel } from './models/token.model';
import { ONE_WEEK_IN_MS } from './utils/date.utils';

export const PCT_BASE = BigInt(1e18);

export const APP_TITLE = 'Quest';

// Env
export const IS_DEV = process.env?.NODE_ENV === 'development';
export const EXPECTED_NETWORKS = IS_DEV ? ['localhost', 'rinkeby'] : ['xDai'];
export const defaultTheme = 'dark';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// Cryptos
export const TOKENS = {
  // Native tokens
  Ether: {
    name: 'Ether',
    symbol: 'ETH',
    token: '',
    decimals: 18,
    native: true,
  } as TokenModel,
  xDAI: {
    name: 'xDAI',
    symbol: 'xDAI',
    decimals: 18,
    native: true,
  } as TokenModel,
  // ERC20 tokens
  Honey: {
    name: 'Honey',
    symbol: 'HNY',
    token: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
    decimals: 18,
  } as TokenModel,
  HoneyTest: {
    name: 'HoneyTest',
    symbol: 'HNYT',
    token: '0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9',
    decimals: 18,
  } as TokenModel,
  Theter: {
    name: 'Tether',
    symbol: 'USDT',
    token: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
    decimals: 18,
  } as TokenModel,
};

// Constants

export const QUEST_STATE = {
  Draft: 'Draft', // Not yet saved
  Active: 'Active', // Contract created
  // Played: 'Played', // At least one active claim
  Expired: 'Expired', // When expireTime is past
  Archived: 'Archived', // When no more funds
};

// Enums
export const QUEST_MODE = {
  Create: 'CREATE',
  Update: 'UPDATE',
  ReadSummary: 'SUMMARY',
  ReadDetail: 'DETAIL',
};

export const BREAKPOINTS = {
  4: '4',
  8: '8',
  16: '16',
  24: '24',
  32: '32',
  40: '40',
  48: '48',
  56: '56',
  64: '64',
  72: '72',
};

export const PAGES = {
  List: 'list',
  Detail: 'detail',
};

export const CLAIM_STATUS = {
  Approved: 'Approved',
  Cancelled: 'Cancelled',
  Vetoed: 'Vetoed',
  Challenged: 'Challenged',
  Executed: 'Executed',
  None: 'None',
  Rejected: 'Rejected',
  Scheduled: 'Scheduled',
};

export const TRANSACTION_STATUS = {
  Confirmed: 'TX_STATUS_CONFIRMED',
  Failed: 'TX_STATUS_FAILED',
  Pending: 'TX_STATUS_PENDING',
  SignatureFailed: 'TX_STATUS_SIGNATURE_FAILED',
  Signed: 'TX_STATUS_SIGNED',
};

export const ESTIMATED_TX_TIME_MS = {
  Default: 15 * 1000,
  QuestCreating: 15 * 1000,
  QuestFunding: 15 * 1000,
  QuestFundsReclaiming: 15 * 1000,
  ClaimScheduling: 30 * 1000,
  ClaimChallenging: 30 * 1000,
  ClaimExecuting: 30 * 1000,
  TokenAproval: 20 * 1000,
};

export const ENUM = {
  QUEST_MODE,
  BREAKPOINTS,
  PAGES,
  CLAIM_STATUS,
  TRANSACTION_STATUS,
  ESTIMATED_TX_TIME_MS,
};

// Default values

export const DEFAULT_AMOUNT = {
  parsedAmount: 0,
  token: undefined,
} as TokenAmountModel;

export const DEFAULT_PAGE = PAGES.List;

export const DEFAULT_FILTER = {
  address: '',
  title: '',
  description: '',
  expire: { start: undefined, end: undefined },
  bounty: DEFAULT_AMOUNT,
} as FilterModel;

export const GQL_MAX_INT = 2 ** 31 - 1;

export const DEAULT_CLAIM_EXECUTION_DELAY_MS = 60 * 1000;

export const DEAULTS = {
  DEFAULT_AMOUNT,
  DEFAULT_PAGE,
  DEFAULT_FILTER,
  GQL_MAX_INT,
  DEAULT_CLAIM_EXECUTION_DELAY_MS,
};
