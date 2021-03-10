import { useMemo } from 'react'
import { Contract, AddressZero } from 'ethers'
import { getNetwork } from '../networks'
import { useWallet } from '../providers/Wallet'

import factoryAbi from '../abis/PartyFactory.json'
import merkleDistributorAbi from '../abis/MerkleDistributor.json'

// account is not optional
export function getSigner(ethersProvider, account) {
  ethersProvider.getSigner(account)
  return ethersProvider.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(ethersProvider, account) {
  return account ? getSigner(ethersProvider, account) : ethersProvider
}

// account is optional
export function getContract(address, ABI, ethersProvider, account) {
  if (!address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(ethersProvider, account)
  )
}

// account is optional
// returns null on errors
function useContract(address, ABI, withSignerIfPossible = true) {
  const { account, ethers } = useWallet()

  return useMemo(() => {
    if (!address || !ABI || !ethers) return null
    try {
      return getContract(
        address,
        ABI,
        ethers,
        withSignerIfPossible && account ? account : undefined
      )
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, ethers, withSignerIfPossible, account])
}

export function useFactoryContract() {
  const { factory } = getNetwork()
  return useContract(factory, factoryAbi)
}

export function useMerkleDistributorContract(merkleDistributorAddress) {
  return useContract(merkleDistributorAddress, merkleDistributorAbi)
}
