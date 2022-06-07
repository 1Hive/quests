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

export const EXPECTED_CHAIN_ID = +env('FORCE_CHAIN_ID') ? [+env('FORCE_CHAIN_ID')] : [100, 4];

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
  Scheduled: 'In review',
  AvailableToExecute: 'Available to execute',
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

export const DEFAULT_CLAIM_EXECUTION_DELAY_MS = 1 * 60 * 1000; // Add 15 minutes by default

export const MAX_LINE_DESCRIPTION = 5;
