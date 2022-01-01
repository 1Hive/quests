import { BigNumber, ethers, ethers as ethersUtil } from 'ethers';
import { noop } from 'lodash-es';
import { getProvider } from 'src/ethereum-providers';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import Web3 from 'web3';
import { toWei } from 'web3-utils';
import { IS_DEV } from '../constants';
import env from '../environment';
import { getDefaultChain } from '../local-settings';
import { wrapError } from './errors.util';
import { Logger } from './logger';
import { roundNumber } from './math.utils';

const DEFAULT_LOCAL_CHAIN = 'private';

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
        Logger.error(error);
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
          if (err != null) Logger.error(`An error occurred: ${err}`);
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

export function createContractAccount() {
  return getWeb3()?.eth.accounts.create();
}

export async function getCurrentAccount(): Promise<string | undefined> {
  return new Promise((res) => {
    getWeb3()?.eth.getAccounts((error: Error, result: any[]) => {
      if (error) {
        if (IS_DEV) Logger.error(error);
        res(undefined);
      }
      res(result.length ? result[0] : undefined);
    });
  });
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

export async function sendTransaction(to: string, amount: TokenAmountModel, onCompleted: any) {
  const from = await getCurrentAccount();
  if (!from)
    return Promise.reject(
      wrapError('User account not connected when trying to send a transaction!', { to, amount }),
    );
  return new Promise((res, rej) =>
    getWeb3()
      ?.eth.sendTransaction({
        from,
        to,
        value: toWei(amount.parsedAmount.toString(), 'ether'),
        chain: getNetworkType(),
      })
      .on('transactionHash', res)
      .on('receipt', onCompleted)
      .catch(rej),
  );
}

export function toBigNumber(amount: TokenAmountModel) {
  const { defaultToken } = getNetwork();
  if (!amount.token) {
    amount.token = defaultToken;
  }
  return ethers.utils.parseUnits(amount.parsedAmount.toString(), amount.token.decimals + 1);
}

export function fromBigNumber(bigNumber: BigNumber | string, decimals: number): number {
  if (typeof bigNumber === 'string') bigNumber = BigNumber.from(bigNumber);
  return roundNumber(+ethers.utils.formatUnits(bigNumber, decimals), 3);
}

export function getDefaultProvider() {
  const ethOrWeb = (window as any).ethereum ?? (window as any).web3;
  if (!ethOrWeb)
    Logger.error(
      "Can't load provider, no provider connected ... (Try to install metamask)",
      getProvider('unknown')?.link?.default,
    );
  return ethOrWeb && new ethersUtil.providers.Web3Provider(ethOrWeb);
}

// Re-export some web3-utils functions
export { isAddress, soliditySha3, toBN, toHex, toUtf8, toChecksumAddress } from 'web3-utils';
