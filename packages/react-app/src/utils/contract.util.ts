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
import Celeste from '../contracts/Celeste.json';

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
    Celeste, // Only when not goerli (hardhat_contracts.json Celeste will override this one only on goerli)
    ...contractsJson[network.chainId][network.networkId].contracts,
    ERC20,
    UniswapPair,
    CelesteDisputeManager,
  };
}

function getContract(
  contractName: string,
  contractAddressOverride?: string,
  walletAddress?: string,
  abiIndex?: number,
): Contract {
  try {
    const id = (contractAddressOverride ?? contractName) + (walletAddress ?? '');
    let contract = contractMap.get(id);
    if (contract) {
      return contract;
    }
    const network = getNetwork();
    if (!contracts) contracts = getContractsJson(network);
    let askedContract = contracts[contractName];
    if (Array.isArray(askedContract) && askedContract.length) {
      if (abiIndex) {
        askedContract = askedContract[abiIndex ?? askedContract.length - 1];
      } else if (contractAddressOverride) {
        askedContract = askedContract.find(
          (c) => c.address.toLowerCase() === contractAddressOverride.toLowerCase(),
        );
      } else {
        askedContract = askedContract[askedContract.length - 1]; // Use the last one
      }
    }
    const contractAddress: string = contractAddressOverride ?? askedContract.address;

    const contractAbi = askedContract.abi;
    const provider = getDefaultProvider();

    if (!contractAddress) throw new Error(`${contractName} address was not defined`);
    if (!contractAbi)
      throw new Error(`${contractName} ABI was not defined, address: ${contractAddress}`);

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

export function getGovernQueueContract(
  walletAddress: string,
  governQueueAddress: string,
): Contract | null {
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

export function getQuestContract(
  questData: { address?: string; version?: number },
  walletAddress?: string,
): Contract {
  return getContract('Quest', questData.address, walletAddress, questData.version);
}

export function getUniswapPairContract(pairAddress: string) {
  return getContract('UniswapPair', pairAddress);
}

export async function getCelesteContract(celesteAddressOverride?: string) {
  const { celesteAddress } = getNetwork();
  return getContract('Celeste', celesteAddressOverride ?? celesteAddress);
}

export async function getCelesteDisputeManagerContract(celesteAddressOverride?: string) {
  const celesteContract = await getCelesteContract(celesteAddressOverride);
  const disputeManagerAddress = await celesteContract.getDisputeManager();
  return getContract('CelesteDisputeManager', disputeManagerAddress);
}

export function getQuestContractInterface(version?: number) {
  return new ethers.utils.Interface(getContractsJson().Quest[version ?? 0].abi);
}

// #endregion
