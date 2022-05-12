import { FilterModel } from './models/filter.model';
import { TokenModel } from './models/token.model';

export const PCT_BASE = BigInt(1e18);

export const APP_TITLE = 'Quests';

// Env
export const IS_DEV = process.env?.NODE_ENV === 'development';
export const EXPECTED_NETWORKS = IS_DEV ? ['localhost', 'rinkeby'] : ['xDai'];
export const DEFAULT_THEME = 'dark';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export const REPO_ADDRESS = 'https://github.com/1Hive/quests/';

// Cryptos
export const TOKENS = Object.freeze({
  // Native tokens
  Ether: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  } as TokenModel,
  xDAI: {
    name: 'xDAI',
    symbol: 'xDAI',
    decimals: 18,
  } as TokenModel,
  // ERC20 tokens
  Thether: {
    name: 'Tether',
    symbol: 'USDT',
    token: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 18,
  } as TokenModel,
  UsdCoin: {
    name: 'USD Coin',
    symbol: 'USDC',
    token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 18,
  } as TokenModel,
  Honey: {
    name: 'Honey',
    symbol: 'HNY',
    token: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
    decimals: 18,
  } as TokenModel,
  RinkebyTheter: {
    name: 'Tether',
    symbol: 'USDT',
    token: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
    decimals: 18,
  } as TokenModel,
  RinkebyHoney: {
    name: 'Honey',
    symbol: 'HNY',
    token: '0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd',
    decimals: 18,
  } as TokenModel,
  HoneyTest: {
    name: 'HoneyTest',
    symbol: 'HNYT',
    token: '0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9',
    decimals: 18,
  } as TokenModel,
  RinkebyDai: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    token: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
    decimals: 18,
  } as TokenModel,
});

export const NETWORK_TOKENS = Object.freeze({
  rinkeby: [TOKENS.HoneyTest, TOKENS.RinkebyTheter, TOKENS.RinkebyHoney, TOKENS.RinkebyDai],
  xdai: [TOKENS.Honey],
  mainnet: [TOKENS.Thether],
});

// Constants

export const GQL_MAX_INT_MS = (2 ** 31 - 1) * 1000;

export const QUESTS_PAGE_SIZE = 4;

// Enums

export const ENUM_QUEST_STATE = Object.freeze({
  All: 'All',
  Draft: 'Draft', // Not yet saved
  Active: 'Active', // Contract created
  // Played: 'Played', // At least one active claim
  Expired: 'Expired', // When expireTime is past
  Archived: 'Archived', // When no more funds
});

export const ENUM_QUEST_VIEW_MODE = Object.freeze({
  Create: 'CREATE',
  Update: 'UPDATE',
  ReadSummary: 'SUMMARY',
  ReadDetail: 'DETAIL',
});

export const ENUM_BREAKPOINTS = Object.freeze({
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
});

export const ENUM_PAGES = Object.freeze({
  List: 'list',
  Detail: 'detail',
});

export const ENUM_CLAIM_STATE = Object.freeze({
  None: 'None',
  Scheduled: 'Scheduled',
  Challenged: 'Challenged',
  // Final states
  Approved: 'Approved',
  Cancelled: 'Cancelled',
  Executed: 'Executed',
  Vetoed: 'Vetoed',
  Rejected: 'Rejected',
});

export const ENUM_TRANSACTION_STATUS = Object.freeze({
  Confirmed: 'TX_STATUS_CONFIRMED',
  Failed: 'TX_STATUS_FAILED',
  Pending: 'TX_STATUS_PENDING',
  SignatureFailed: 'TX_STATUS_SIGNATURE_FAILED',
  Signed: 'TX_STATUS_SIGNED',
  WaitingForSignature: 'TX_WAITING_FOR_SIGNATURE',
});

export const ENUM_ESTIMATED_TX_TIME_MS = Object.freeze({
  Default: 15 * 1000,
  QuestCreating: 20 * 1000,
  QuestFunding: 20 * 1000,
  QuestFundsReclaiming: 15 * 1000,
  ClaimScheduling: 30 * 1000,
  ClaimChallenging: 30 * 1000,
  ClaimExecuting: 30 * 1000,
  ChallengeResolving: 20 * 1000,
  TokenAproval: 20 * 1000,
});

export const ENUM_DISPUTE_STATES = Object.freeze({
  NotDisputed: 0,
  Disputed: 1,
  DisputeNotRuled: 2,
  DisputeRuledForChallenger: 3,
  DisputeRuledForSubmitter: 4,
});

export const ENUM = Object.freeze({
  ENUM_QUEST_VIEW_MODE,
  ENUM_BREAKPOINTS,
  ENUM_PAGES,
  ENUM_CLAIM_STATE,
  ENUM_TRANSACTION_STATE: ENUM_TRANSACTION_STATUS,
  ENUM_ESTIMATED_TX_TIME_MS,
  ENUM_DISPUTE_STATES,
});

// Default values

export const DEFAULT_PAGE = ENUM_PAGES.List;

export const DEFAULT_FILTER = Object.freeze({
  address: '',
  title: '',
  description: '',
  minExpireTime: null,
  bounty: undefined,
  status: ENUM_QUEST_STATE.Active,
} as FilterModel);

export const DEFAULT_CLAIM_EXECUTION_DELAY_MS = 60 * 15 * 1000; // Add 15 minutes by default

export const MAX_LINE_DESCRIPTION = 5;
