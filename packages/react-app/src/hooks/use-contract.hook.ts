import { Contract, ContractInterface } from 'ethers';
import log from 'loglevel';
import { useMemo } from 'react';
import { ADDRESS_ZERO } from '../constants';
import contractsJson from '../contracts/hardhat_contracts.json';
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

// account is optional
// returns null on errors
function useContract(contractName: string, withSignerIfPossible = true) {
  const { account, ethers } = useWallet();
  if (!contracts) contracts = contractsJson[ethers.network.chainId].rinkeby.contracts;
  const askedContract = contracts[contractName];

  return useMemo(() => {
    if (!askedContract.address || !askedContract.abi || !ethers) return null;
    try {
      return getContract(
        askedContract.address,
        askedContract.abi,
        ethers,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      log.error('Failed to get contract', error);
      return null;
    }
  }, [askedContract.address, askedContract.abi, ethers, withSignerIfPossible, account]);
}

export function useFactoryContract() {
  return useContract('QuestFactory');
}
