import { BigNumber, Contract, ethers } from 'ethers';
import { TokenModel } from 'src/models/token.model';
import { getDefaultProvider } from 'src/utils/web3.utils';
import { toChecksumAddress } from 'web3-utils';
import { ContractInstanceError } from 'src/models/contract-error';
import { Logger } from 'src/utils/logger';
import ERC20 from '../contracts/ERC20.json';
import GovernQueue from '../contracts/GovernQueue.json';
import contractsJson from '../contracts/hardhat_contracts.json';
import { getNetwork } from '../networks';
import Celeste from '../contracts/Celeste.json';
import PriceOracle from '../contracts/PriceOracle.json';

let contracts: any;

// walletAddress is not optional
export function getSigner(ethersProvider: any, walletAddress: any) {
  ethersProvider.getSigner(walletAddress);
  return ethersProvider.getSigner(walletAddress).connectUnchecked();
}

// walletAddress is optional
export function getProviderOrSigner(ethersProvider: any, walletAddress?: string) {
  return walletAddress ? getSigner(ethersProvider, walletAddress) : ethersProvider;
}

function getContractsJson(network?: any) {
  network = network ?? getNetwork();
  return {
    ...contractsJson[network.chainId][network.name.toLowerCase()].contracts,
    GovernQueue,
    ERC20,
    Celeste,
    PriceOracle,
  };
}

function getContract(
  contractName: string,
  questAddressOverride?: string,
  walletAddress?: string,
): Contract | null {
  try {
    const network = getNetwork();
    if (!contracts) contracts = getContractsJson(network);
    const askedContract = contracts[contractName];
    const contractAddress = questAddressOverride ?? askedContract.address;
    const contractAbi = askedContract.abi ?? askedContract;
    const provider = getDefaultProvider();

    if (!contractAddress) throw new Error(`${contractName} address was not defined`);
    if (!contractAbi) throw new Error(`${contractName} ABI was not defined`);

    return new Contract(contractAddress, contractAbi, getProviderOrSigner(provider, walletAddress));
  } catch (error) {
    throw new ContractInstanceError(
      contractName,
      `Failed to instanciate contract <${contractName}>`,
      error,
    );
  }
}

// #region Public

export function getQuestFactoryContract(walletAddress: string) {
  return getContract('QuestFactory', undefined, walletAddress);
}

export function getGovernQueueContract(walletAddress: string): Contract | null {
  const { governQueueAddress } = getNetwork();
  return getContract('GovernQueue', governQueueAddress, walletAddress);
}

export function getERC20Contract(
  token: TokenModel | string,
  walletAddress?: string,
): Contract | null {
  const tokenAddress = typeof token === 'string' ? token : token?.token;
  return getContract('ERC20', tokenAddress, walletAddress);
}

export async function getTokenInfo(tokenAddress: string) {
  try {
    const tokenContract = getContract('ERC20', tokenAddress);
    if (tokenContract) {
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      const name = await tokenContract.name();
      return {
        symbol,
        decimals,
        name,
        amount: BigNumber.from(0).toString(),
        token: toChecksumAddress(tokenAddress),
      } as TokenModel;
    }
  } catch (error) {
    Logger.exception(error);
  }
  return tokenAddress;
}

export function getQuestContract(questAddress: string, walletAddress?: string): Contract | null {
  return getContract('Quest', questAddress, walletAddress);
}

export function getCelesteContract() {
  const { celesteAddress } = getNetwork();
  return getContract('Celeste', celesteAddress);
}

export function getQuestContractInterface() {
  return new ethers.utils.Interface(getContractsJson().Quest.abi);
}

// export function getBalanceCheckerContract() {
//   return new ethers.utils.Interface(getContractsJson().Quest.abi);
// }

// #endregion
