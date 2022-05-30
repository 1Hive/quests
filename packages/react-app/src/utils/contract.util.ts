import { BigNumber, Contract, ethers } from 'ethers';
import { TokenModel } from 'src/models/token.model';
import { getDefaultProvider } from 'src/utils/web3.utils';
import { toChecksumAddress } from 'web3-utils';
import { ContractInstanceError } from 'src/models/contract-error';
import { Logger } from 'src/utils/logger';
import { cacheTokenInfo } from 'src/services/cache.service';
import ERC20 from '../contracts/ERC20.json';
import UniswapPair from '../contracts/UniswapPair.json';
import contractsJson from '../contracts/hardhat_contracts.json';
import CelesteDisputeManager from '../contracts/CelesteDisputeManager.json';
import { getNetwork } from '../networks';

let contracts: any;
const contractMap = new Map<string, Contract>();

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
    ERC20,
    UniswapPair,
    CelesteDisputeManager,
  };
}

function getContract(
  contractName: string,
  contractAddressOverride?: string,
  walletAddress?: string,
): Contract {
  try {
    const id = (contractAddressOverride ?? contractName) + (walletAddress ?? '');
    let contract = contractMap.get(id);
    if (contract) {
      return contract;
    }
    const network = getNetwork();
    if (!contracts) contracts = getContractsJson(network);
    const askedContract = contracts[contractName];
    const contractAddress: string = contractAddressOverride ?? askedContract.address;
    const contractAbi = askedContract.abi ?? askedContract;
    const provider = getDefaultProvider();

    if (!contractAddress) throw new Error(`${contractName} address was not defined`);
    if (!contractAbi) throw new Error(`${contractName} ABI was not defined`);

    contract = new Contract(
      contractAddress,
      contractAbi,
      getProviderOrSigner(provider, walletAddress),
    );
    contractMap.set(id, contract);
    return contract;
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
    const tokenContract = getERC20Contract(tokenAddress);
    if (tokenContract) {
      const { symbol, decimals, name } = await cacheTokenInfo(tokenAddress, tokenContract);
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
  return null;
}

export function getQuestContract(questAddress: string, walletAddress?: string): Contract {
  return getContract('Quest', questAddress, walletAddress);
}

export function getUniswapPairContract(pairAddress: string) {
  return getContract('UniswapPair', pairAddress);
}

export async function getCelesteDisputeManagerContract() {
  const { celesteAddress } = getNetwork();
  const disputeManagerAddress = await getContract('Celeste', celesteAddress).getDisputeManager();
  return getContract('CelesteDisputeManager', disputeManagerAddress);
}

export function getQuestContractInterface() {
  return new ethers.utils.Interface(getContractsJson().Quest.abi);
}

// #endregion
