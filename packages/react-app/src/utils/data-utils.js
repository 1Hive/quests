import { toMs } from './date-utils'

export function transformPartyData(party) {
  return {
    ...party,
    createdAt: toMs(party.createdAt),
    upfrontPct: BigInt(party.upfrontPct),
    vestingPeriod: toMs(party.vestingPeriod),
    vestingDurationInPeriods: parseInt(party.vestingDurationInPeriods),
    vestingCliffInPeriods: parseInt(party.vestingCliffInPeriods),
    totalAmountClaimed: BigInt(party.totalAmountClaimed || '0'),
    vestings: party.vestings.map(transformVestingData),
  }
}

export function transformUserData(user) {
  return { ...user, claims: user.claims.map(transformClaimData) }
}

function transformVestingData(vesting) {
  return {
    ...vesting,
    startTime: toMs(vesting.startTime),
    amount: BigInt(vesting.amount),
    periodsClaimed: parseInt(vesting.periodsClaimed),
    amountClaimed: BigInt(vesting.amountClaimed),
    claims: vesting.claims?.map(transformClaimData) || null,
  }
}

function transformClaimData(claim) {
  return {
    ...claim,
    createdAt: toMs(claim.createdAt),
    amount: BigInt(claim.amount),
    vesting: claim.vesting ? transformVestingData(claim.vesting) : null,
  }
}
