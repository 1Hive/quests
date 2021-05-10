import log from 'loglevel';
import { TOKENS } from '../constants';
import { toMs } from './date-utils';

export async function convertTo(from, toToken) {
  const res = await fetch(
    `https://coingecko.p.rapidapi.com/simple/price?ids=${[
      from.token.symb,
      toToken.symb,
    ]}&vs_currencies=usd`,
    {
      method: 'GET',
    },
  );

  log.log(res);
  return { amount: res, token: toToken };
}

export async function computeTotalFunds(funds) {
  if (!funds?.length) return { amount: 0, token: TOKENS.theter };
  log.log(funds);
  const tetherFunds = await Promise.all(funds.map((x) => convertTo(x.amount, TOKENS.theter)));
  const amount = tetherFunds.reduce((total, x) => total + x.amount);
  return { amount, token: TOKENS.theter };
}

export function transformVestingData(vesting) {
  return {
    ...vesting,
    startTime: toMs(vesting.startTime),
    amount: BigInt(vesting.amount),
    periodsClaimed: parseInt(vesting.periodsClaimed),
    amountClaimed: BigInt(vesting.amountClaimed),
    // eslint-disable-next-line no-use-before-define
    claims: vesting.claims?.map(transformClaimData) || null,
  };
}

export function transformClaimData(claim) {
  return {
    ...claim,
    createdAt: toMs(claim.createdAt),
    amount: BigInt(claim.amount),
    vesting: claim.vesting ? transformVestingData(claim.vesting) : null,
  };
}

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
  };
}

export function transformUserData(user) {
  return { ...user, claims: user.claims.map(transformClaimData) };
}
