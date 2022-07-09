import { EXPECTED_CHAIN_ID } from './constants';
import env from './environment';

const CHAIN_ID = 'CHAIN_ID';

let currentChain =
  env('FORCE_CHAIN_ID') ?? localStorage.getItem(CHAIN_ID) ?? env('DEFAULT_CHAIN_ID') ?? 100; // default xdai

export function getCurrentChain() {
  return currentChain;
}

export function setCurrentChain(chainId: number) {
  if (EXPECTED_CHAIN_ID.includes(chainId) && currentChain !== chainId) {
    currentChain = chainId;
    localStorage.setItem(CHAIN_ID, chainId.toString());
  }
}
