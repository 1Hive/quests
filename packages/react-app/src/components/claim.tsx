import { useViewport, Timer } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ENUM_CLAIM_STATE,
  ENUM_DISPUTE_STATES,
  ENUM_QUEST_STATE,
  ENUM_TRANSACTION_STATUS,
} from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useWallet } from 'src/contexts/wallet.context';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { useNow } from 'src/hooks/use-now.hook';
import { ClaimModel } from 'src/models/claim.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { compareCaseInsensitive } from 'src/utils/string.util';
import styled, { css } from 'styled-components';
import { AddressFieldInput } from './field-input/address-field-input';
import AmountFieldInput from './field-input/amount-field-input';
import { FieldInput } from './field-input/field-input';
import ChallengeModal from './modals/challenge-modal';
import ExecuteClaimModal from './modals/execute-claim-modal';
import ResolveChallengeModal from './modals/resolve-challenge-modal';
import { StateTag } from './state-tag';
import { Outset, ChildSpacer } from './utils/spacer-util';

// #region StyledComponents

const AddressWrapperStyled = styled.div<{ isSmallScreen: boolean }>`
  ${({ isSmallScreen }) =>
    isSmallScreen &&
    css`
      max-width: 200px;
    `}
`;

// #endregion

type Props = {
  claim: ClaimModel;
  isLoading?: boolean;
  challengeDeposit: TokenAmountModel;
  questData: QuestModel;
};

export default function Claim({ claim, isLoading, challengeDeposit, questData }: Props) {
  const { walletAddress, walletConnected } = useWallet();
  const { transaction } = useTransactionContext();
  const [state, setState] = useState(claim.state);
  const { below } = useViewport();
  const [waitForClose, setWaitForClose] = useState(false);
  const [actionButton, setActionButton] = useState<ReactNode>();
  const isMountedRef = useIsMountedRef();
  const now = useNow();
  const claimable = useMemo(() => !!claim.executionTimeMs && claim.executionTimeMs <= now, [now]);

  useEffect(() => {
    setState(
      claim.state === ENUM_CLAIM_STATE.Scheduled && claimable
        ? ENUM_CLAIM_STATE.AvailableToExecute
        : claim.state,
    );
  }, [claim.state, claimable]);

  const timer = useMemo(
    () => !claimable && claim.executionTimeMs && <Timer end={new Date(claim.executionTimeMs)} />,
    [claim.executionTimeMs, claimable],
  );

  const onActionClose = () => {
    setWaitForClose(false);
  };

  useEffect(() => {
    // If tx completion impact Claims, update them
    if (
      transaction?.args?.questAddress === questData.address &&
      claim.container &&
      transaction?.args?.containerId === claim.container.id
    ) {
      // Little hack here but if the tx is in this state, modal is probably open
      if (transaction?.status === ENUM_TRANSACTION_STATUS.WaitingForSignature) {
        setWaitForClose(true);
      } else if (transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed) {
        switch (transaction.type) {
          case 'ClaimChallengeResolve':
            {
              // Second arg is the dispute resolution result
              const newState =
                transaction.args.disputeState === ENUM_DISPUTE_STATES.DisputeRuledForChallenger
                  ? ENUM_CLAIM_STATE.Rejected
                  : ENUM_CLAIM_STATE.Executed;
              setState(newState);
            }
            break;
          case 'ClaimExecute':
            setState(ENUM_CLAIM_STATE.Executed);
            break;
          case 'ClaimChallenge':
            setTimeout(() => {
              setState(ENUM_CLAIM_STATE.Challenged);
            }, 1000); // Wait for subgrapph to index challenge event
            break;
          default:
        }
      }
    }
  }, [transaction?.status, transaction?.type, transaction?.[0], claim.container]);

  useEffect(() => {
    if (waitForClose || !state || !isMountedRef.current) return;
    if (state === ENUM_CLAIM_STATE.Scheduled || state === ENUM_CLAIM_STATE.AvailableToExecute) {
      if (
        compareCaseInsensitive(walletAddress, claim.playerAddress) ||
        (claimable && questData.state !== ENUM_QUEST_STATE.Active)
      ) {
        setActionButton(
          <>
            <ExecuteClaimModal
              claim={claim}
              questTotalBounty={questData.bounty}
              onClose={onActionClose}
              claimable={claimable}
            />
            {timer}
          </>,
        );
        return;
      }
      setActionButton(
        <>
          <ChallengeModal
            claim={claim}
            challengeDeposit={challengeDeposit}
            onClose={onActionClose}
          />
          {timer}
        </>,
      );
      return;
    }

    if (state === ENUM_CLAIM_STATE.Challenged || state === ENUM_CLAIM_STATE.Rejected) {
      setActionButton(<ResolveChallengeModal claim={claim} onClose={onActionClose} />);
      return;
    }
    setActionButton(undefined);
  }, [state, walletAddress, waitForClose, claim, questData.bounty, challengeDeposit, claimable]);

  return (
    <div className="wide">
      <Outset>
        <ChildSpacer
          size={below('medium') ? 0 : 16}
          justify="start"
          align={below('medium') ? 'start' : 'center'}
          buttonEnd
          vertical={below('medium')}
        >
          <FieldInput label="Status" isLoading={isLoading || state === ENUM_CLAIM_STATE.None}>
            <StateTag state={state ?? ''} className="pl-0" />
          </FieldInput>
          <AddressWrapperStyled isSmallScreen={below('medium')}>
            <AddressFieldInput
              id="playerAddress"
              value={claim.playerAddress}
              label={walletAddress === claim.playerAddress ? 'You' : 'Claiming player'}
              isLoading={isLoading || !claim.playerAddress}
            />
          </AddressWrapperStyled>
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
          {walletConnected && state && actionButton}
        </ChildSpacer>
      </Outset>
    </div>
  );
}
