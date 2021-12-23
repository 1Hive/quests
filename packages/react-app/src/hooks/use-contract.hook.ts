import { Contract, ContractInterface, ethers as ethersUtil } from 'ethers';
import { useMemo } from 'react';
import { Token } from 'src/models/token';
import { Logger } from 'src/utils/logger';
import { fromBigNumber, getDefaultProvider } from 'src/utils/web3.utils';
import { ADDRESS_ZERO } from '../constants';
import ERC20 from '../contracts/ERC20.json';
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
export function getProviderOrSigner(ethersProvider: any, account?: any) {
  return account ? getSigner(ethersProvider, account) : ethersProvider;
}

// account is optional
export function getContract(
  address: string,
  ABI: ContractInterface,
  ethersProvider: any,
  account?: any,
) {
  if (!address || address === ADDRESS_ZERO) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(ethersProvider, account));
}

function getContractsJson(network?: any) {
  network = network ?? getNetwork();
  return {
    ...contractsJson[network.chainId][network.name.toLowerCase()].contracts,
    GovernQueue: GovernQueueAbi,
    ERC20,
  };
}

// account is optional
// returns null on errors
function useContract(contractName: string, addressOverride?: string, withSignerIfPossible = true) {
  let account: any;
  if (withSignerIfPossible) account = useWallet().account;
  const network = getNetwork();
  if (!contracts) contracts = getContractsJson(network);
  const askedContract = contracts[contractName];
  const contractAddress = addressOverride ?? askedContract.address;
  const contractAbi = askedContract.abi ?? askedContract;
  const provider = getDefaultProvider();

  const handleGetContract = () => {
    if (!contractAddress) Logger.warn('Address was not defined for contract ', contractName);
    if (!contractAddress || !contractAbi || !provider) return null;
    try {
      return getContract(
        contractAddress,
        contractAbi,
        provider,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      Logger.error('Failed to get contract', error);
      return null;
    }
  };

  if (!withSignerIfPossible) {
    return handleGetContract();
  }

  return useMemo(
    () => handleGetContract(),
    [contractAddress, contractAbi, provider, withSignerIfPossible, account],
  );
}

export function useFactoryContract() {
  return useContract('QuestFactory');
}

export function useGovernQueueContract() {
  return useContract('GovernQueue');
}

export function useERC20Contract(token: Token, withSignerIfPossible = true) {
  return useContract('ERC20', token.address, withSignerIfPossible);
}

export async function getBalanceOf(token: Token, address: string) {
  const contract = useERC20Contract(token, false);
  if (!contract) return null;
  const balance = await contract.balanceOf(address);
  return {
    token,
    amount: fromBigNumber(balance, token.decimals),
  };
}
