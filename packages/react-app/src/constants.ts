import { FilterModel } from './models/filter.model';
import { TokenModel } from './models/token.model';

export const PCT_BASE = BigInt(1e18);

export const APP_TITLE = 'Quest';

// Env
export const IS_DEV = process.env?.NODE_ENV === 'development';
export const EXPECTED_NETWORKS = IS_DEV ? ['localhost', 'rinkeby'] : ['xDai'];
export const defaultTheme = 'light';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// Cryptos
export const TOKENS = {
  Ether: {
    name: 'Ether',
    symb: 'ETH',
    address: '',
    decimals: 18,
  } as TokenModel,
  Honey: {
    name: 'Honey',
    symb: 'HNY',
    address: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
    decimals: 18,
  } as TokenModel,
  HoneyTest: {
    name: 'HoneyTest',
    symb: 'HNYT',
    address: '0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9',
    decimals: 18,
  } as TokenModel,
  Theter: {
    name: 'Tether',
    symb: 'USDT',
    address: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
    decimals: 18,
  } as TokenModel,
  xDAI: {
    name: 'xDAI',
    symb: 'xDAI',
    address: '0x26472cc7f4cb43ae9b3f18c705de8c34578933f9',
    decimals: 18,
  } as TokenModel,
};

// Constants

export const QUEST_STATUS = {
  Active: { id: 'active', label: 'Active' },
  Completed: { id: 'completed', label: 'Completed' },
  Aborted: { id: 'aborted', label: 'Aborted' },
  Draft: { id: 'draft', label: 'Draft' },
};

export const QUEST_SUMMARY_MAX_CHARACTERS = 600;

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

// Default values

export const DEFAULT_AMOUNT = {
  amount: 0,
  token: undefined,
};

export const DEFAULT_PAGE = PAGES.List;

export const DEFAULT_FILTER = {
  address: '',
  title: '',
  description: '',
  expire: { start: undefined, end: undefined },
  bounty: DEFAULT_AMOUNT,
} as FilterModel;

export const GQL_MAX_INT = 2 ** 31 - 1;

export const DEAULT_CLAIM_EXECUTION_DELAY = 60;
