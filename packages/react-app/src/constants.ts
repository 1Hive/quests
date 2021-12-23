import { Filter } from './models/filter';
import { Token } from './models/token';

export const PCT_BASE = BigInt(1e18);

export const APP_TITLE = 'Quest';

// Env
export const IS_DEV = process.env?.NODE_ENV === 'development';
export const EXPECTED_NETWORKS = IS_DEV ? ['localhost', 'rinkeby'] : ['xDai'];
export const defaultTheme = 'light';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// Cryptos
export const TOKENS = {
  Honey: {
    name: 'Honey',
    symb: 'HNYT',
    address: '0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9',
    decimals: 18,
  } as Token,
  Theter: {
    name: 'Tether',
    symb: 'USDT',
    address: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
    decimals: 18,
  } as Token,
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
} as Filter;

export const GQL_MAX_INT = 2 ** 31 - 1;
