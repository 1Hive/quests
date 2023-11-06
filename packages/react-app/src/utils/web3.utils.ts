import { BigNumber, ethers } from 'ethers';
import { noop } from 'lodash-es';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import Web3 from 'web3';
import { isDesktop, isMobile } from 'react-device-detect';
import { getProvider } from 'src/ethereum-providers';
import { TokenModel } from 'src/models/token.model';
import env from '../environment';
import { getCurrentChain } from '../local-settings';
import { Logger } from './logger';

const DEFAULT_LOCAL_CHAIN = 'custom';

export function getWeb3(): Web3 {
  let ethereum: any = null;
  let web3: any = null;

  const w = window as any;
  if (w.eth) {
    ethereum = w.eth;
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
  const { chainId } = getNetwork();
  const providersIds = ['injected', 'frame'];

  let providers = providersIds.map((id) => getProvider(id));

  providers.push({
    ...getProvider('walletconnect'),
    useWalletConf: {
      rpc: {
        [chainId]: getRpcUrl(chainId),
      },
    },
  } as any);
  providers = providers.filter(
    (p) =>
      p != null &&
      ((p.type === 'Mobile' && isMobile) ||
        (p.type === 'Desktop' && isDesktop) ||
        p.type === 'Any'),
  );
  return providers as any[];
}

export function getNetworkId(chainId = getCurrentChain()) {
  let key;
  if (+chainId === 1) key = 'mainnet';
  if (+chainId === 3) key = 'ropsten';
  if (+chainId === 4) key = 'rinkeby';
  if (+chainId === 5) key = 'goerli';
  if (+chainId === 100) key = 'gnosis';
  if (+chainId === 1337) key = 'local';
  if (key) {
    if (env('STAGING')) key += 'Staging';
    return key;
  }

  return DEFAULT_LOCAL_CHAIN;
}

export function isLocalOrUnknownNetwork(chainId = getCurrentChain()) {
  return chainId === 1337 || getNetworkId(chainId) === DEFAULT_LOCAL_CHAIN;
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider: any) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf;
    }
    return connectors;
  }, {});
}

export function getNetworkName(chainId = getCurrentChain()) {
  const chainIdStr = String(chainId);

  if (chainIdStr === '1') return 'Mainnet';
  if (chainIdStr === '3') return 'Ropsten';
  if (chainIdStr === '4') return 'Rinkeby';
  if (chainIdStr === '5') return 'Goerli';
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

export function toBigNumber(amount: TokenAmountModel | string | number) {
  if (typeof amount === 'string' || typeof amount === 'number') {
    amount = {
      parsedAmount: +amount,
      token: {
        decimals: 18,
      } as TokenModel,
    };
  }
  return ethers.utils.parseUnits(amount.parsedAmount.toString(), amount.token.decimals);
}

export function fromBigNumber(bigNumber: BigNumber | string, decimals: number = 18): number {
  if (typeof bigNumber === 'string') bigNumber = BigNumber.from(bigNumber);
  return +ethers.utils.formatUnits(bigNumber, decimals);
}

export function getDefaultProvider(): ethers.providers.Provider {
  const { networkId, chainId: expectedChainId } = getNetwork();
  const injectedProvider = (window as any).eth ?? (window as any).web3?.currentProvider;
  let provider;
  if (!injectedProvider || +injectedProvider.chainId !== +expectedChainId) {
    provider = new ethers.providers.StaticJsonRpcProvider(getRpcUrl(), networkId);
  } else {
    provider = new ethers.providers.Web3Provider(injectedProvider);
  }

  return provider;
}

export function getRpcUrl(chainId?: number) {
  const { rpcUri, rpcKeyEnvName } = getNetwork(chainId);
  return `${rpcUri}${rpcKeyEnvName ? `/${env(rpcKeyEnvName)}` : ''}`;
}

export function getExplorerUrl(chainId?: number) {
  const { explorer, networkId } = getNetwork(chainId);
  switch (explorer) {
    case 'etherscan':
      return `https://${networkId}.etherscan.io`;
    case 'blockscout':
      return 'https://blockscout.com/xdai/mainnet';
    case 'polygonscan':
      return 'https://polygonscan.com';
    case 'gnosisscan':
      return 'https://gnosisscan.io';
    default:
      return '';
  }
}

// Re-export some web3-utils functions
export { isAddress, soliditySha3, toBN, toHex, toUtf8, toChecksumAddress } from 'web3-utils';
