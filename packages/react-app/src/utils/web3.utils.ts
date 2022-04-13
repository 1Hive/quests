import { BigNumber, ethers, providers as Providers } from 'ethers';
import { noop } from 'lodash-es';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import Web3 from 'web3';
import env from '../environment';
import { getDefaultChain } from '../local-settings';
import { Logger } from './logger';

const DEFAULT_LOCAL_CHAIN = 'private';

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
  const providers = [{ id: 'injected' }];

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    } as any);
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
  if (chainIdStr === '100') return 'xDai';

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

export function fromBigNumber(bigNumber: BigNumber | string, decimals: number | undefined): number {
  if (typeof bigNumber === 'string') bigNumber = BigNumber.from(bigNumber);
  return +ethers.utils.formatUnits(bigNumber, decimals ?? 18);
}

export function getDefaultProvider() {
  const { chainId: expectedChainId } = getNetwork();
  let provider = ethOrWeb;

  if (!provider || +provider.chainId !== +expectedChainId) {
    const alchemyId = env('ALCHEMY_API_KEY');
    if (alchemyId) {
      provider = new Providers.AlchemyProvider('rinkeby', alchemyId);
    } else {
      throw new Error(`No http provider key provided in env`);
    }
  }

  return provider && new ethers.providers.Web3Provider(provider);
}

// Re-export some web3-utils functions
export { isAddress, soliditySha3, toBN, toHex, toUtf8, toChecksumAddress } from 'web3-utils';
