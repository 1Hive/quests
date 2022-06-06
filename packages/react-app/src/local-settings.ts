import env from './environment';

const CHAIN_ID = 'CHAIN_ID';

let currentChain = localStorage.getItem(CHAIN_ID) ?? +env(CHAIN_ID) ?? 100; // default xdai;

export function getCurrentChain() {
  return currentChain;
}

export function setCurrentChain(chainId: number) {
  currentChain = chainId;
  localStorage.setItem(CHAIN_ID, chainId.toString());
}
