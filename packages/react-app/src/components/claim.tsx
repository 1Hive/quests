import { useEffect, useMemo, useState } from 'react';
import { ENUM_CLAIM_STATE, ENUM_DISPUTE_STATES, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useWallet } from 'src/contexts/wallet.context';
import { ClaimModel } from 'src/models/claim.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { Logger } from 'src/utils/logger';
import { AddressFieldInput } from './field-input/address-field-input';
import AmountFieldInput from './field-input/amount-field-input';
import { FieldInput } from './field-input/field-input';
import ChallengeModal from './modals/challenge-modal';
import ExecuteClaimModal from './modals/execute-claim-modal';
import ResolveChallengeModal from './modals/resolve-challenge-modal';
import { StateTag } from './state-tag';
import { Outset, ChildSpacer } from './utils/spacer-util';

type Props = {
  claim: ClaimModel;
  isLoading?: boolean;
  questTotalBounty?: TokenAmountModel | null;
  challengeDeposit: TokenAmountModel;
  questData: QuestModel;
};

export default function Claim({
  claim,
  isLoading,
  questTotalBounty,
  challengeDeposit,
  questData,
}: Props) {
  const { walletAddress } = useWallet();
  const { transaction } = useTransactionContext();
  const [state, setState] = useState(claim.state);

  useEffect(() => {
    setState(claim.state);
  }, [claim.state]);

  const actionButton = useMemo(() => {
    if (state === ENUM_CLAIM_STATE.Scheduled) {
      if (walletAddress === claim.playerAddress)
        return <ExecuteClaimModal claim={claim} questTotalBounty={questTotalBounty} />;
      return <ChallengeModal claim={claim} challengeDeposit={challengeDeposit} />;
    }
    if (state === ENUM_CLAIM_STATE.Challenged) {
      return <ResolveChallengeModal claim={claim} />;
    }
    if (!state) Logger.error(`Claim doesn't have valid state`, { claim, state });
    return undefined;
  }, [state, walletAddress]);

  useEffect(() => {
    // If tx completion impact Claims, update them
    if (
      transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed &&
      transaction?.questAddress === questData.address &&
      claim.container &&
      transaction?.args?.[0] === claim.container.id
    ) {
      switch (transaction.type) {
        case 'ClaimChallengeResolve':
          {
            // Second arg is the dispute resolution result
            const newState =
              transaction.args[1] === ENUM_DISPUTE_STATES.DisputeRuledForChallenger
                ? ENUM_CLAIM_STATE.Rejected
                : ENUM_CLAIM_STATE.Executed;
            setState(newState);
          }
          break;
        case 'ClaimExecute':
          setState(ENUM_CLAIM_STATE.Executed);
          break;
        case 'ClaimChallenge':
          setState(ENUM_CLAIM_STATE.Challenged);
          break;
        default:
      }
    }
  }, [transaction?.status, transaction?.type, transaction?.questAddress, claim.container]);

  return (
    <div className="wide">
      <Outset>
        <ChildSpacer size={16} justify="start" align="center" buttonEnd>
          <FieldInput label="Status" isLoading={isLoading || state === ENUM_CLAIM_STATE.None}>
            <StateTag state={state ?? ''} className="pl-0" />
          </FieldInput>
          <AddressFieldInput
            id="playerAddress"
            value={claim.playerAddress}
            label={walletAddress === claim.playerAddress ? 'You' : 'Claiming player'}
            isLoading={isLoading || !claim.playerAddress}
          />
          {claim.claimAll ? (
            <FieldInput
              label="Claimed amount"
              isLoading={isLoading || state === ENUM_CLAIM_STATE.None}
            >
              All available
            </FieldInput>
          ) : (
            <AmountFieldInput
              id="amount"
              label="Claimed amount"
              value={claim.claimedAmount}
              isLoading={isLoading || state === ENUM_CLAIM_STATE.None}
            />
          )}
          {walletAddress && actionButton}
        </ChildSpacer>
      </Outset>
    </div>
  );
}