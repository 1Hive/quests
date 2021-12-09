import env from './environment';

const CHAIN_ID = 'CHAIN_ID';

export function getDefaultChain() {
  return Number(env(CHAIN_ID)) || 0x64; // default xdai;
}
