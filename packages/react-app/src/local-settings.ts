import env from './environment';

const CHAIN_ID = 'CHAIN_ID';

export function getDefaultChain() {
  return +env(CHAIN_ID) || 100; // default xdai;
}
