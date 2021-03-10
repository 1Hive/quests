// import { UNI } from './../../constants/index'
// import { TokenAmount, JSBI, ChainId } from '@uniswap/sdk'
// import { useEffect, useState } from 'react'
// import { useActiveWeb3React } from '../../hooks'
// import { useMerkleDistributorContract } from '../../hooks/useContract'
// import { useSingleCallResult } from '../multicall/hooks'
// import { calculateGasMargin, isAddress } from '../../utils'
// import { useTransactionAdder } from '../transactions/hooks'
// import { readAirtableAmount } from '../utils/airtable'
// import { getNetwork } from '../networks'

// // const CLAIM_PROMISES = {}

// // // returns the claim for the given address, or null if not valid
// // function fetchClaim(account, chainId) {
// //   const formatted = isAddress(account)
// //   if (!formatted) return Promise.reject(new Error('Invalid address'))
// //   const key = `${chainId}:${account}`

// //   return (CLAIM_PROMISES[key] =
// //     CLAIM_PROMISES[key] ??
// //     fetch(
// //       `https://gentle-frost-9e74.uniswap.workers.dev/${chainId}/${formatted}`
// //     )
// //       .then((res) => {
// //         if (res.status === 200) {
// //           return res.json()
// //         } else {
// //           console.debug(
// //             `No claim for account ${formatted} on chain ID ${chainId}`
// //           )
// //           return null
// //         }
// //       })
// //       .catch((error) => {
// //         console.error('Failed to get claim data', error)
// //       }))
// // }

// // parse distributorContract blob and detect if user has claim data
// // null means we know it does not
// export function useUserClaimData(account, partyAddress) {
//   const chainId = getNetwork().chainId

//   const key = `${chainId}:${account}`
//   const [claimInfo, setClaimInfo] = useState({})

//   useEffect(() => {
//     if (!account || !chainId) return
//     readAirtableAmount(partyAddress, chainId, account).then(accountClaimInfo =>
//       setClaimInfo(claimInfo => {
//         return {
//           ...claimInfo,
//           [key]: accountClaimInfo,
//         }
//       })
//     )
//   }, [account, chainId, key, partyAddress])

//   return account && chainId ? claimInfo[key] : undefined
// }

// // check if user is in blob and has not yet claimed UNI
// export function useUserHasAvailableClaim(account, merkleDistributorAddress) {
//   const userClaimData = useUserClaimData(account)
//   const distributorContract = useMerkleDistributorContract(
//     merkleDistributorAddress
//   )
//   const isClaimedResult = useSingleCallResult(
//     distributorContract,
//     'isClaimed',
//     [userClaimData?.index]
//   )
//   // user is in blob and contract marks as unclaimed
//   return Boolean(
//     userClaimData &&
//       !isClaimedResult.loading &&
//       isClaimedResult.result?.[0] === false
//   )
// }

// export function useUserUnclaimedAmount(account) {
//   const { chainId } = useActiveWeb3React()
//   const userClaimData = useUserClaimData(account)
//   const canClaim = useUserHasAvailableClaim(account)

//   const uni = chainId ? UNI[chainId] : undefined
//   if (!uni) return undefined
//   if (!canClaim || !userClaimData) {
//     return new TokenAmount(uni, JSBI.BigInt(0))
//   }
//   return new TokenAmount(uni, JSBI.BigInt(userClaimData.amount))
// }

// export function useClaimCallback(account) {
//   // get claim data for this account
//   const { library, chainId } = useActiveWeb3React()
//   const claimData = useUserClaimData(account)

//   // used for popup summary
//   const unClaimedAmount = useUserUnclaimedAmount(account)
//   const addTransaction = useTransactionAdder()
//   const distributorContract = useMerkleDistributorContract()

//   const claimCallback = async function() {
//     if (!claimData || !account || !library || !chainId || !distributorContract)
//       return

//     const args = [claimData.index, account, claimData.amount, claimData.proof]

//     return distributorContract.estimateGas
//       .claim(...args, {})
//       .then(estimatedGasLimit => {
//         return distributorContract
//           .claim(...args, {
//             value: null,
//             gasLimit: calculateGasMargin(estimatedGasLimit),
//           })
//           .then(response => {
//             addTransaction(response, {
//               summary: `Claimed ${unClaimedAmount?.toSignificant(4)} UNI`,
//               claim: { recipient: account },
//             })
//             return response.hash
//           })
//       })
//   }

//   return { claimCallback }
// }
