import { toMs } from './date-utils';

function transformClaimData(claim) {
  return {
    ...claim,
    createdAt: toMs(claim.createdAt),
    amount: BigInt(claim.amount),
    // eslint-disable-next-line no-use-before-define
    vesting: claim.vesting ? transformVestingData(claim.vesting) : null,
  };
}

function transformVestingData(vesting) {
  return {
    ...vesting,
    startTime: toMs(vesting.startTime),
    amount: BigInt(vesting.amount),
    periodsClaimed: parseInt(vesting.periodsClaimed, 10),
    amountClaimed: BigInt(vesting.amountClaimed),
    claims: vesting.claims?.map(transformClaimData) || null,
  };
}

export function transformPartyData(party) {
  return {
    ...party,
    createdAt: toMs(party.createdAt),
    upfrontPct: BigInt(party.upfrontPct),
    vestingPeriod: toMs(party.vestingPeriod),
    vestingDurationInPeriods: parseInt(party.vestingDurationInPeriods, 10),
    vestingCliffInPeriods: parseInt(party.vestingCliffInPeriods, 10),
    totalAmountClaimed: BigInt(party.totalAmountClaimed || '0'),
    vestings: party.vestings.map(transformVestingData),
  };
}

export function transformUserData(user) {
  return { ...user, claims: user.claims.map(transformClaimData) };
}
