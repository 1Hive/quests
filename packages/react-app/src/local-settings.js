import env from './environment';

const DEFAULT_CHAIN_ID = 'CHAIN_ID';

export function getDefaultChain() {
  return Number(env(DEFAULT_CHAIN_ID)) || 0x64; // default xdai;
}
