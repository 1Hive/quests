import { useViewport, Timer } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { GUpx } from 'src/utils/style.util';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useWallet } from 'src/contexts/wallet.context';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { useNow } from 'src/hooks/use-now.hook';
import { ClaimModel } from 'src/models/claim.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { compareCaseInsensitive } from 'src/utils/string.util';
import styled, { css } from 'styled-components';
import { ContainerModel } from 'src/models/govern.model';
import { ClaimStatus } from 'src/enums/claim-status.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { DisputeStatus } from 'src/enums/dispute-status.enum';
import { QuestStatus } from 'src/enums/quest-status.enum';
import { CollapsableBlock } from './collapsable-block';
import { AddressFieldInput } from './field-input/address-field-input';
import AmountFieldInput from './field-input/amount-field-input';
import { FieldInput } from './field-input/field-input';
import TextFieldInput from './field-input/text-field-input';
import ChallengeModal from './modals/challenge-modal';
import ExecuteClaimModal from './modals/execute-claim-modal';
import ResolveChallengeModal from './modals/resolve-challenge-modal';
import VetoModal from './modals/veto-modal';
import { StatusTag } from './status-tag';
import { Outset, ChildSpacer } from './utils/spacer-util';
import * as QuestService from '../services/quest.service';
import { ActionsPlaceholder } from './actions-placeholder';

// #region StyledComponents

const AddressWrapperStyled = styled.div<{ isSmallScreen: boolean }>`
  ${({ isSmallScreen }) =>
    isSmallScreen &&
    css`
      max-width: 200px;
    `}
`;

const EvidenceWrapperStyled = styled.div`
  padding: ${GUpx(2)};
`;

const TimerWrapperStyled = styled.div`
  margin: 0 ${GUpx(2)};
  display: flex;
`;

const TimeableActionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const LineSyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-gap: 8px;
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
  const [status, setStatus] = useState<ClaimStatus | undefined>(claim.state);
  const { below } = useViewport();
  const [waitForClose, setWaitForClose] = useState(false);
  const [actionButton, setActionButton] = useState<ReactNode>();
  const [challengeReason, setChallengeReason] = useState<string>();
  const [vetoReason, setVetoReason] = useState<string>();
  const isMountedRef = useIsMountedRef();
  const now = useNow();
  const claimable = useMemo(() => !!claim.executionTimeMs && claim.executionTimeMs <= now, [now]);
  const { managerAddress } = getNetwork();

  useEffect(() => {
    setStatus(
      claim.state === ClaimStatus.Scheduled && claimable
        ? ClaimStatus.AvailableToExecute
        : claim.state,
    );
  }, [claim.state, claimable]);

  const timer = useMemo(
    () =>
      !claimable &&
      claim.executionTimeMs && (
        <TimerWrapperStyled>
          <Timer end={new Date(claim.executionTimeMs)} />
        </TimerWrapperStyled>
      ),
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
      if (transaction?.status === TransactionStatus.WaitingForSignature) {
        setWaitForClose(true);
      } else if (transaction?.status === TransactionStatus.Confirmed) {
        switch (transaction.type) {
          case 'ClaimChallengeResolve':
            {
              // Second arg is the dispute resolution result
              const newState =
                transaction.args.disputeState === DisputeStatus.DisputeRuledForChallenger
                  ? ClaimStatus.Rejected
                  : ClaimStatus.Executed;
              setStatus(newState);
            }
            break;
          case 'ClaimExecute':
            setStatus(ClaimStatus.Executed);
            break;
          case 'ClaimChallenge':
            setTimeout(() => {
              setStatus(ClaimStatus.Challenged);
            }, 1000); // Wait for subgrapph to index challenge event
            break;
          case 'ClaimVeto':
            setTimeout(() => {
              setStatus(ClaimStatus.Vetoed);
            }, 1000); // Wait for subgrapph to index veto event
            break;
          default:
        }
      }
    }
  }, [transaction?.status, transaction?.type, transaction?.[0], claim.container]);

  useEffect(() => {
    if (waitForClose || !status || !isMountedRef.current) return;
    if (status === ClaimStatus.Scheduled || status === ClaimStatus.AvailableToExecute) {
      if (
        compareCaseInsensitive(walletAddress, claim.playerAddress) ||
        (claimable && questData.status !== QuestStatus.Active)
      ) {
        setActionButton(
          <TimeableActionWrapper>
            {timer}
            <ExecuteClaimModal
              claim={claim}
              questTotalBounty={questData.bounty}
              onClose={onActionClose}
              claimable={claimable}
            />
          </TimeableActionWrapper>,
        );
        return;
      }
      setActionButton(
        <TimeableActionWrapper>
          {timer}
          <ChallengeModal
            claim={{ ...claim, state: status }}
            challengeDeposit={challengeDeposit}
            onClose={onActionClose}
          />
        </TimeableActionWrapper>,
      );
      return;
    }

    if (
      claim.container &&
      (status === ClaimStatus.Challenged ||
        status === ClaimStatus.Rejected ||
        status === ClaimStatus.Executed ||
        status === ClaimStatus.Vetoed)
    ) {
      (async (_state: string, _container: ContainerModel) => {
        setChallengeReason(await QuestService.fetchChallengeReason(_container));
        if (_state === ClaimStatus.Vetoed) {
          setVetoReason(await QuestService.fetchVetoReason(_container));
        }
      })(status, claim.container);
    }

    if (status === ClaimStatus.Challenged) {
      setActionButton(
        <>
          <ResolveChallengeModal claim={claim} onClose={onActionClose} />
        </>,
      );
      return;
    }

    setActionButton(undefined);
  }, [
    status,
    walletAddress,
    waitForClose,
    claim,
    questData.bounty,
    challengeDeposit,
    claimable,
    claim.container,
  ]);

  return (
    <div className={`claim-wrapper ${isLoading ? 'loading' : ''}`}>
      <CollapsableBlock
        hideState
        visible
        copyable={false}
        collapsed
        header={
          <div className="wide">
            <Outset>
              <ChildSpacer
                size={below('medium') ? 0 : 16}
                justify="start"
                align={below('medium') ? 'start' : 'center'}
                buttonEnd
                vertical={below('medium')}
              >
                {status && (
                  <FieldInput label="Status" isLoading={isLoading || status === ClaimStatus.None}>
                    <StatusTag status={status} className="pl-0" />
                  </FieldInput>
                )}
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
                    isLoading={isLoading || status === ClaimStatus.None}
                  >
                    All available
                  </FieldInput>
                ) : (
                  <AmountFieldInput
                    id="amount"
                    label="Claimed amount"
                    value={claim.claimedAmount}
                    isLoading={isLoading || status === ClaimStatus.None}
                  />
                )}
                {walletConnected && status ? (
                  <>
                    {actionButton}
                    {managerAddress === walletAddress &&
                      claim.state !== ClaimStatus.Cancelled &&
                      claim.state !== ClaimStatus.Executed &&
                      claim.state !== ClaimStatus.Vetoed &&
                      claim.state !== ClaimStatus.Rejected &&
                      claim.state !== ClaimStatus.Approved && (
                        <VetoModal claim={claim} onClose={onActionClose} />
                      )}
                  </>
                ) : (
                  <LineSyled>
                    {timer}
                    <ActionsPlaceholder />
                  </LineSyled>
                )}
              </ChildSpacer>
            </Outset>
          </div>
        }
      >
        <EvidenceWrapperStyled>
          <TextFieldInput
            id="evidence"
            value={claim.evidence}
            isLoading={isLoading || status === ClaimStatus.None}
            isMarkDown
            wide
            label="Evidence of completion"
          />
          {claim.contactInformation && (
            <TextFieldInput
              id="contact"
              value={claim.contactInformation}
              wide
              label="Contact information"
            />
          )}
          {challengeReason && (
            <TextFieldInput
              id="reason"
              value={challengeReason}
              isMarkDown
              wide
              label="Challenge reason"
            />
          )}
          {vetoReason && (
            <TextFieldInput id="reason" value={vetoReason} isMarkDown wide label="Veto reason" />
          )}
        </EvidenceWrapperStyled>
      </CollapsableBlock>
    </div>
  );
}
