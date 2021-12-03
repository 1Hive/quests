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
    address: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
  } as Token,
  theter: {
    name: 'Tether',
    symb: 'USDT',
    address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
  } as Token,
  wxdai: {
    name: 'Wrapped XDAI',
    symb: 'WXDAI',
    address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  } as Token,
  wether: {
    name: 'Wrapped Ethereum',
    symb: 'WETH',
    address: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
  } as Token,
};

// Enums
export const QUEST_STATUS = {
  active: { id: 'active', label: 'Active' },
  completed: { id: 'completed', label: 'Completed' },
  aborted: { id: 'aborted', label: 'Aborted' },
  draft: { id: 'draft', label: 'Draft' },
};

export const QUEST_MODE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  READ: 'READ',
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

// Default values

export const defaultFilter = {
  search: '',
  expire: { start: undefined, end: undefined },
  tags: [],
  bounty: { amount: 0, token: TOKENS.honey },
  showFull: false,
  foundedQuests: false,
  createdQuests: false,
  playedQuests: false,
} as Filter;

// SUBGRAPH
export const SUBGRAPH_URI = 'https://api.studio.thegraph.com/query/10030/1hive-quests/0.0.1';

// Handle retro compatibility correctly
export const QUEST_VERSION = '2.5';
export const MIN_QUEST_VERSION = '2.5';
export const GQL_MAX_INT = 2 ** 31 - 1;
