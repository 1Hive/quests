import Web3 from 'web3';
import { toWei } from 'web3-utils';
import env from '../environment';
import { getDefaultChain } from '../local-settings';

const DEFAULT_LOCAL_CHAIN = 'private';

function getWeb3() {
  // @ts-ignore
  const web3 = new Web3(window.ethereum);
  // @ts-ignore
  window.ethereum?.enable().catch((error) => {
    // User denied account access
    console.error(error);
  });
  return web3;
}

export function getUseWalletProviders() {
  const providers = [{ id: 'injected' }];

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    });
  }

  return providers;
}

export function getNetworkType(chainId = getDefaultChain()) {
  const chainIdStr = String(chainId);

  if (chainIdStr === '1') return 'mainnet';
  if (chainIdStr === '3') return 'ropsten';
  if (chainIdStr === '4') return 'rinkeby';
  if (chainIdStr === '100') return 'xdai';

  return DEFAULT_LOCAL_CHAIN;
}

export function isLocalOrUnknownNetwork(chainId = getDefaultChain()) {
  return getNetworkType(chainId) === DEFAULT_LOCAL_CHAIN;
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf;
    }
    return connectors;
  }, {});
}

export function getNetworkName(chainId = getDefaultChain()) {
  chainId = String(chainId);

  if (chainId === '1') return 'Mainnet';
  if (chainId === '3') return 'Ropsten';
  if (chainId === '4') return 'Rinkeby';
  if (chainId === '100') return 'xDai';

  return 'unknown';
}

export function createContractAccount() {
  return getWeb3().eth.accounts.create();
}

export async function getCurrentAccount() {
  return new Promise((res) => {
    getWeb3().eth.getAccounts((error, result) => {
      if (error) {
        console.error(error);
      } else {
        res(result.length ? result[0] : null);
      }
    });
  });
}

export function isConnectedToProvider() {
  return getCurrentAccount() !== null;
}
export const addressPattern = '(0x)?[0-9a-fA-F]{40}';
const ETH_ADDRESS_SPLIT_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g;
const ETH_ADDRESS_TEST_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g;

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

// Detect Ethereum addresses in a string and transform each part.
//
// `callback` is called on every part with two params:
//   - The string of the current part.
//   - A boolean indicating if it is an address.
//
export function transformAddresses(str, callback) {
  return str
    .split(ETH_ADDRESS_SPLIT_REGEX)
    .map((part, index) => callback(part, ETH_ADDRESS_TEST_REGEX.test(part), index));
}

export function addressesEqualNoSum(first, second) {
  first = first && first.toLowerCase();
  second = second && second.toLowerCase();
  return first === second;
}

export async function sendTransaction(to, amount, onCompleted) {
  const from = await getCurrentAccount();
  return new Promise((res, rej) =>
    getWeb3()
      .eth.sendTransaction({
        from,
        to,
        value: toWei(amount.amount.toString(), 'ether'),
        chain: getNetworkType(),
      })
      .on('transactionHash', res)
      .on('receipt', onCompleted)
      .catch(rej),
  );
}

// Re-export some web3-utils functions
export { isAddress, soliditySha3, toUtf8 } from 'web3-utils';
