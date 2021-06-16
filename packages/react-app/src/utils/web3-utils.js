import log from 'loglevel';
import Web3 from 'web3';
import { toWei } from 'web3-utils';
import { IS_DEV } from '../constants';
import env from '../environment';
import { getDefaultChain } from '../local-settings';
import { wrapError } from './errors-util';

const DEFAULT_LOCAL_CHAIN = 'private';

function getWeb3() {
  // @ts-ignore
  const web3 = new Web3(window.ethereum);
  // @ts-ignore
  if (!window.ethereum.isConnected()) {
    window.ethereum?.enable().catch((error) => {
      // User denied account access
      log.error(error);
    });
  }
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
  const chainIdStr = String(chainId);

  if (chainIdStr === '1') return 'Mainnet';
  if (chainIdStr === '3') return 'Ropsten';
  if (chainIdStr === '4') return 'Rinkeby';
  if (chainIdStr === '100') return 'xDai';

  return 'unknown';
}

export function createContractAccount() {
  return getWeb3()?.eth.accounts.create();
}

export async function getCurrentAccount() {
  return new Promise((res) => {
    getWeb3()?.eth.getAccounts((error, result) => {
      if (error) {
        if (IS_DEV) log.error(error);
        res(undefined);
      }
      res(result.length ? result[0] : undefined);
    });
  });
}

export async function isConnected() {
  try {
    return window?.ethereum?.isConnected() ?? false;
  } catch (error) {
    return false;
  }
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
  if (!from)
    return Promise.reject(
      wrapError('User account not connected when trying to send a transaction!', { to, amount }),
    );
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
