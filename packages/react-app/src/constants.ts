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
  honey: {
    name: 'Honey',
    symb: 'HNY',
    address: '0x5e352ed38066417d70817399dc6d9d9236b5f203',
    decimals: 18,
  } as Token,
  theter: {
    name: 'Tether',
    symb: 'USDT',
    address: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
    decimals: 18,
  } as Token,
  wxdai: {
    name: 'Wrapped XDAI',
    symb: 'WXDAI',
    address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    decimals: 18,
  } as Token,
  wether: {
    name: 'Wrapped Ethereum',
    symb: 'WETH',
    address: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
    decimals: 18,
  } as Token,
};
export const QUEST_STATUS = {
  active: { id: 'active', label: 'Active' },
  completed: { id: 'completed', label: 'Completed' },
  aborted: { id: 'aborted', label: 'Aborted' },
  draft: { id: 'draft', label: 'Draft' },
};

// Enums
export const QUEST_MODE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  READ_SUMMARY: 'SUMMARY',
  READ_DETAIL: 'DETAIL',
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
  List: 'List',
  Detail: 'Detail',
};

// Default values

export const DEFAULT_TOKEN = TOKENS.theter;

export const DEFAULT_AMOUNT = {
  amount: 0,
  token: DEFAULT_TOKEN,
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
