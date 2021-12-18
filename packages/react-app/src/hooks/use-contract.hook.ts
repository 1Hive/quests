import { Contract, ContractInterface } from 'ethers';
import { useMemo } from 'react';
import { Token } from 'src/models/token';
import { Logger } from 'src/utils/logger';
import { ADDRESS_ZERO } from '../constants';
import ERC20Abi from '../contracts/ERC20.json';
import GovernQueueAbi from '../contracts/GovernQueue.json';
import contractsJson from '../contracts/hardhat_contracts.json';
import { getNetwork } from '../networks';
import { useWallet } from '../providers/wallet.context';

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

// account is optional
export function getContract(
  address: string,
  ABI: ContractInterface,
  ethersProvider: any,
  account: any,
) {
  if (!address || address === ADDRESS_ZERO) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(ethersProvider, account));
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
function useContract(contractName: string, addressOverride?: string, withSignerIfPossible = true) {
  const { account, ethers } = useWallet();
  const network = getNetwork();
  if (!contracts) contracts = getContractsJson(network);
  const askedContract = contracts[contractName];
  const contractAddress = addressOverride ?? askedContract.address;
  const contractAbi = askedContract.abi ?? askedContract;

  return useMemo(() => {
    if (!contractAddress) Logger.warn('Address was not defined for contract ', contractName);
    if (!contractAddress || !contractAbi || !ethers) return null;
    try {
      return getContract(
        contractAddress,
        contractAbi,
        ethers,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      Logger.error('Failed to get contract', error);
      return null;
    }
  }, [contractAddress, contractAbi, ethers, withSignerIfPossible, account]);
}

export function useFactoryContract() {
  return useContract('QuestFactory');
}

export function useGovernQueueContract() {
  return useContract('GovernQueue');
}

export function useERC20Contract(token: Token) {
  return useContract('ERC20', token.address);
}
