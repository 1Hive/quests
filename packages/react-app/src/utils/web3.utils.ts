import { BigNumber, ethers } from 'ethers';
import { noop } from 'lodash-es';
import { getProvider } from 'src/ethereum-providers';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import Web3 from 'web3';
import { isDesktop, isMobile } from 'react-device-detect';
import env from '../environment';
import { getDefaultChain } from '../local-settings';
import { Logger } from './logger';

const DEFAULT_LOCAL_CHAIN = '';

const ethOrWeb = (window as any).ethereum ?? (window as any).web3?.currentProvider;
ethOrWeb?.on('chainChanged', (_chainId: string) => window.location.reload());

export function getWeb3(): Web3 {
  let ethereum: any = null;
  let web3: any = null;

  const w = window as any;
  if (w.ethereum) {
    ethereum = w.ethereum;
    web3 = new Web3(ethereum);

    if (!ethereum.isConnected()) {
      ethereum.enable().catch((error: Error) => {
        // User denied account access
        Logger.exception(error);
      });
    }
  }

  return web3;
}

export async function isConnected() {
  return new Promise((res) => {
    if (!getWeb3()?.eth) res(false);
    else
      getWeb3().eth.getAccounts((err: Error, accounts: any[]) => {
        if (accounts.length !== 0) res(true);
        else {
          if (err != null) Logger.exception(err, `An error occurred when connecting wallet`);
          res(false);
        }
      });
  });
}

export function getUseWalletProviders() {
  const providersIds = ['injected', 'frame'];

  const providers = providersIds.map((id) => getProvider(id));

  return providers.filter(
    (p) =>
      p != null &&
      ((p.type === 'Mobile' && isMobile) ||
        (p.type === 'Desktop' && isDesktop) ||
        p.type === 'Any'),
  ) as any[];
}

export function getNetworkId(chainId = getDefaultChain()) {
  const chainIdStr = String(chainId);

  let key;
  if (chainIdStr === '1') key = 'mainnet';
  if (chainIdStr === '3') key = 'ropsten';
  if (chainIdStr === '4') key = 'rinkeby';
  if (chainIdStr === '100') key = 'xdai';
  if (key) {
    if (env('STAGING')) key += 'Staging';
    return key;
  }

  return DEFAULT_LOCAL_CHAIN;
}

export function isLocalOrUnknownNetwork(chainId = getDefaultChain()) {
  return getNetworkId(chainId) === DEFAULT_LOCAL_CHAIN;
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider: any) => {
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
  if (chainIdStr === '100') return 'Gnosis';

  return 'unknown';
}

export const addressPattern = '(0x)?[0-9a-fA-F]{40}';
const ETH_ADDRESS_SPLIT_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g;
const ETH_ADDRESS_TEST_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g;

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export function transformAddresses(str: string, callback: Function = noop) {
  return str
    .split(ETH_ADDRESS_SPLIT_REGEX)
    .map((part, index) => callback(part, ETH_ADDRESS_TEST_REGEX.test(part), index));
}

export function addressesEqualNoSum(first: string, second: string) {
  first = first && first.toLowerCase();
  second = second && second.toLowerCase();
  return first === second;
}

export function toBigNumber(amount: TokenAmountModel) {
  return ethers.utils.parseUnits(amount.parsedAmount.toString(), amount.token.decimals);
}

export function fromBigNumber(bigNumber: BigNumber | string, decimals: number = 18): number {
  if (typeof bigNumber === 'string') bigNumber = BigNumber.from(bigNumber);
  return +ethers.utils.formatUnits(bigNumber, decimals);
}

export function getDefaultProvider() {
  const { httpProvider, chainId: expectedChainId } = getNetwork();
  let provider = ethOrWeb;
  if (!provider || +provider.chainId !== +expectedChainId) {
    provider = new Web3.providers.HttpProvider(`${httpProvider}/${env('INFURA_API_KEY')}`);
  }

  return provider && new ethers.providers.Web3Provider(provider);
}

// Re-export some web3-utils functions
export { isAddress, soliditySha3, toBN, toHex, toUtf8, toChecksumAddress } from 'web3-utils';
