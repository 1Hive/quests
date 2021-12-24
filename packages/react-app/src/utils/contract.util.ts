import { Contract } from 'ethers';
import { TokenModel } from 'src/models/token.model';
import { Logger } from 'src/utils/logger';
import { ADDRESS_ZERO } from '../constants';
import ERC20Abi from '../contracts/ERC20.json';
import GovernQueueAbi from '../contracts/GovernQueue.json';
import contractsJson from '../contracts/hardhat_contracts.json';
import { getNetwork } from '../networks';

let contracts: any;

// account is not optional
export function getSigner(ethersProvider: any, account: any) {
  ethersProvider.getSigner(account);
  return ethersProvider.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(ethersProvider: any, account: any) {
  return account ? getSigner(ethersProvider, account) : ethersProvider;
}

function getContractsJson(network: any) {
  return {
    ...contractsJson[network.chainId][network.name.toLowerCase()].contracts,
    GovernQueue: GovernQueueAbi,
    ERC20: ERC20Abi,
  };
}

// account is optional
// returns null on errors
function getContract(contractName: string, addressOverride?: string, withSignerIfPossible = false) {
  const account = undefined;
  const ethers = undefined;
  const network = getNetwork();
  contracts = getContractsJson(network);
  const askedContract = contracts[contractName];
  const contractAddress = addressOverride ?? askedContract.address;
  const contractAbi = askedContract.abi ?? askedContract;
  if (!contractAddress) Logger.warn('Address was not defined for contract ', contractName);
  if (!contractAddress || !contractAbi) return null;
  try {
    if (!contractAddress || contractAddress === ADDRESS_ZERO) {
      throw Error(`Invalid 'address' parameter '${contractAddress}'.`);
    }
    const signerOrProvider =
      withSignerIfPossible && ethers && account ? getProviderOrSigner(ethers, account) : undefined;
    return new Contract(contractAddress, contractAbi, signerOrProvider);
  } catch (error) {
    Logger.error('Failed to get contract', error);
    return null;
  }
}

export function getQuestFactoryContract() {
  return getContract('QuestFactory');
}

export function getGovernQueueContract() {
  return getContract('GovernQueue');
}

export function getERC20Contract(token: TokenModel) {
  return getContract('ERC20', token.address);
}
