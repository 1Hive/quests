import { useViewport } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import { ENUM_CLAIM_STATE, ENUM_DISPUTE_STATES, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useWallet } from 'src/contexts/wallet.context';
import { ClaimModel } from 'src/models/claim.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { Logger } from 'src/utils/logger';
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
  const { below } = useViewport();
  const [waitForClose, setWaitForClose] = useState(false);
  const [actionButton, setActionButton] = useState<ReactNode>();

  useEffect(() => {
    setState(claim.state);
  }, [claim.state]);

  useEffect(() => {
    if (waitForClose) return;
    if (state === ENUM_CLAIM_STATE.Scheduled) {
      if (walletAddress === claim.playerAddress) {
        setActionButton(
          <ExecuteClaimModal
            claim={claim}
            questTotalBounty={questTotalBounty}
            onClose={onActionClose}
          />,
        );
      } else {
        setActionButton(
          <ChallengeModal
            claim={claim}
            challengeDeposit={challengeDeposit}
            onClose={onActionClose}
          />,
        );
      }
    } else if (state === ENUM_CLAIM_STATE.Challenged) {
      setActionButton(<ResolveChallengeModal claim={claim} onClose={onActionClose} />);
    } else if (!state) {
      Logger.error(`Claim doesn't have valid state`, { claim, state });
      setActionButton(undefined);
    }
  }, [state, walletAddress, waitForClose]);

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
            setState(ENUM_CLAIM_STATE.Challenged);
            break;
          default:
        }
      }
    }
  }, [transaction?.status, transaction?.type, transaction?.[0], claim.container]);

  const onActionClose = () => {
    setWaitForClose(false);
  };

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
          {walletAddress && actionButton}
        </ChildSpacer>
      </Outset>
    </div>
  );
}
