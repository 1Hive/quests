import { Contract, ContractInterface, ethers } from 'ethers';
import { useMemo } from 'react';
import { TokenModel } from 'src/models/token.model';
import { fromBigNumber, getDefaultProvider } from 'src/utils/web3.utils';
import { toNumber } from 'web3-utils';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { ContractError } from 'src/models/contract-error';
import { ADDRESS_ZERO } from '../constants';
import ERC20 from '../contracts/ERC20.json';
import GovernQueue from '../contracts/GovernQueue.json';
import contractsJson from '../contracts/hardhat_contracts.json';
import { getNetwork } from '../networks';
import { useWallet } from '../contexts/wallet.context';

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
): Contract {
  if (!address || address === ADDRESS_ZERO) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  // Check if wallet chain is same as app
  const { chainId, name } = getNetwork();
  const provider = (window as any).ethereum || (window as any).web3.currentProvider;
  if (toNumber(provider?.chainId) !== chainId) throw new Error(`Wallet not connected to ${name}`);

  return new Contract(address, ABI, getProviderOrSigner(ethersProvider, account));
}

function getContractsJson(network?: any) {
  network = network ?? getNetwork();
  return {
    ...contractsJson[network.chainId][network.name.toLowerCase()].contracts,
    GovernQueue,
    ERC20,
  };
}

// account is optional
// returns null on errors
function useContract(
  contractName: string,
  addressOverride?: string | null,
  withSignerIfPossible = true,
): Contract | ContractError {
  try {
    let account: any;
    if (withSignerIfPossible) account = useWallet().account;
    const network = getNetwork();
    if (!contracts) contracts = getContractsJson(network);
    const askedContract = contracts[contractName];
    const contractAddress = addressOverride === undefined ? askedContract.address : addressOverride;
    const contractAbi = askedContract.abi ?? askedContract;
    const provider = getDefaultProvider();

    const handleGetContract = (): Contract => {
      if (!contractAddress) throw new Error(`${contractName} Address was not defined`);
      if (!contractAbi) throw new Error(`${contractName} ABI was not defined`);
      return getContract(
        contractAddress,
        contractAbi,
        provider,
        withSignerIfPossible && account ? account : undefined,
      );
    };

    if (!withSignerIfPossible) {
      return handleGetContract();
    }

    return useMemo(
      () => handleGetContract(),
      [contractAddress, contractAbi, provider, withSignerIfPossible, account],
    );
  } catch (error) {
    return new ContractError(
      contractName,
      `Failed to instanciate contract <${contractName}>`,
      error,
    );
  }
}

// #region Public

export function useFactoryContract() {
  return useContract('QuestFactory', undefined, true);
}

export function useGovernQueueContract(): Contract | ContractError {
  const { governQueue } = getNetwork();
  return useContract('GovernQueue', governQueue, true);
}

export function useERC20Contract(
  token: TokenModel,
  withSignerIfPossible = true,
): Contract | ContractError {
  return useContract('ERC20', token.token, withSignerIfPossible);
}

export function useQuestContract(
  address?: string,
  withSignerIfPossible = true,
): Contract | ContractError {
  return useContract('Quest', address ?? null, withSignerIfPossible);
}

export async function getBalanceOf(token: TokenModel, address: string): Promise<TokenAmountModel> {
  const contract = useERC20Contract(token, false);
  if (contract instanceof ContractError) throw contract; // Trhow error
  const balance = await contract.balanceOf(address);
  return {
    token,
    parsedAmount: fromBigNumber(balance, token.decimals),
  };
}

export function getQuestContractInterface() {
  return new ethers.utils.Interface(getContractsJson().Quest.abi);
}

// #endregion
