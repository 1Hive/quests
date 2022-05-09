import {
  Button,
  IconFlag,
  Accordion,
  IdentityBadge,
  Info,
  Link,
  IconCaution,
} from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { ClaimModel } from 'src/models/claim.model';
import { ENUM, ENUM_DISPUTE_STATES, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ChallengeModel } from 'src/models/challenge.model';
import { GUpx } from 'src/utils/style.util';
import { useWallet } from 'src/contexts/wallet.context';
import Skeleton from 'react-loading-skeleton';
import { getCelesteContract, getGovernQueueContract } from 'src/utils/contract.util';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { getNetwork } from 'src/networks';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import { Outset } from '../utils/spacer-util';
import { DisputeModel } from '../../models/dispute.model';
import TextFieldInput from '../field-input/text-field-input';
import { HelpTooltip } from '../field-input/help-tooltip';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx(1)};
  width: fit-content;
`;

const HeaderStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelStyled = styled.span`
  margin-left: ${GUpx(1)};
`;

const FinalRulingStyled = styled.span`
  margin-right: ${GUpx(1)};
  margin-top: ${GUpx(0.5)};
  display: flex;
`;

const FinalRulingWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${GUpx(4)};
`;

const RulingInfoStyled = styled(Info)`
  width: 100%;
  display: flex;
`;

const OnlyStackholderWarnStyled = styled(Info)`
  padding: ${GUpx(1)};
  display: flex;
  align-items: center;
`;

const LinkStyled = styled(Link)`
  margin-left: ${GUpx(1)};
`;

// #endregion

type Props = {
  claim: ClaimModel;
  onClose?: ModalCallback;
};

export default function ResolveChallengeModal({ claim, onClose = noop }: Props) {
  const { walletAddress } = useWallet();
  const { networkId } = getNetwork();
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [isRuled, setRuled] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeModel | null>();
  const [dispute, setDispute] = useState<DisputeModel>();
  const [isStackholder, setIsStackholder] = useState(false);
  const { setTransaction } = useTransactionContext();
  const governQueueContract = getGovernQueueContract(walletAddress);
  const celesteContract = getCelesteContract();

  useEffect(() => {
    const fetchChallengeAndDispute = async () => {
      if (celesteContract) {
        if (!claim.container) throw new Error('Container is required to fetch challenge disputes');
        const challengeResult = await QuestService.fetchChallenge(claim.container);
        if (!challengeResult)
          throw new Error(`Failed to fetch challenge with container id ${claim.container.id}`);
        setChallenge(challengeResult);
        if (challengeResult) {
          const disputeModel = await QuestService.fetchChallengeDispute(challengeResult);
          setDispute(disputeModel ?? undefined);
        }
        setLoading(false);
      }
    };
    fetchChallengeAndDispute();
  }, [claim.container]);

  useEffect(() => {
    if (dispute?.state)
      setRuled(
        dispute.state === ENUM_DISPUTE_STATES.DisputeRuledForChallenger ||
          dispute.state === ENUM_DISPUTE_STATES.DisputeRuledForSubmitter,
      );
  }, [dispute?.state]);

  useEffect(() => {
    if (challenge && claim)
      setIsStackholder(
        challenge.challengerAddress === walletAddress || claim.playerAddress === walletAddress,
      );
  }, [claim, challenge, walletAddress]);

  const resolveChallengeTx = async () => {
    try {
      setLoading(true);
      if (!claim.container) throw new Error('Container is not defined');
      const message = 'Resolving claim challenge';
      setTransaction({
        id: uniqueId(),
        estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.ChallengeResolving,
        message,
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
        type: 'ClaimChallengeResolve',
        args: {
          questAddress: claim.questAddress,
          containerId: claim.container.id,
          disputeState: dispute!.state,
        },
      });
      const challengeTxReceipt = await QuestService.resolveClaimChallenge(
        walletAddress,
        claim.container,
        dispute!,
        (txHash) => {
          setTransaction(
            (oldTx) =>
              oldTx && {
                ...oldTx,
                hash: txHash,
                status: ENUM_TRANSACTION_STATUS.Pending,
              },
          );
        },
      );
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: challengeTxReceipt?.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          },
      );
      if (!challengeTxReceipt?.status) throw new Error('Failed to challenge the quest');
    } catch (e: any) {
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: ENUM_TRANSACTION_STATUS.Failed,
            message: computeTransactionErrorMessage(e),
          },
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const player = (
    <IdentityBadge
      customLabel="Player"
      entity={claim?.playerAddress}
      connectedAccount={claim?.playerAddress === walletAddress}
    />
  );

  const challenger = (
    <IdentityBadge
      customLabel="Challenger"
      entity={challenge?.challengerAddress}
      connectedAccount={challenge?.challengerAddress === walletAddress}
    />
  );

  const finalRuling = (
    <FinalRulingWrapper>
      {dispute?.state && (
        <RulingInfoStyled mode={isRuled ? 'info' : 'warning'}>
          <FinalRulingStyled>
            {isRuled ? (
              'Ruled in favor of'
            ) : (
              <>
                Ruling in progress, please come back later...
                {networkId === 'gnosis' ? (
                  <LinkStyled external href={`https://celeste.1hive.org/#/disputes/${dispute.id}`}>
                    See dispute
                  </LinkStyled>
                ) : (
                  <HelpTooltip
                    tooltip={`This is a mocked celeste dispute with id ${dispute.id}`}
                    key={dispute.id}
                  />
                )}
              </>
            )}
          </FinalRulingStyled>
          {dispute.state === ENUM_DISPUTE_STATES.DisputeRuledForChallenger && challenger}
          {dispute.state === ENUM_DISPUTE_STATES.DisputeRuledForSubmitter && player}
        </RulingInfoStyled>
      )}
    </FinalRulingWrapper>
  );

  return (
    <ModalBase
      id="resolve-challenge-modal"
      title={
        <HeaderStyled>
          <h1>Resolve claim challenge</h1>
        </HeaderStyled>
      }
      openButton={
        <OpenButtonWrapperStyled>
          <OpenButtonStyled
            icon={<IconFlag />}
            onClick={() => setOpened(true)}
            label="Open resolve"
            mode="positive"
            disabled={loading || !dispute || !governQueueContract || !celesteContract}
          />
        </OpenButtonWrapperStyled>
      }
      buttons={[
        <Fragment key="warnMessage">
          {isRuled && !isStackholder && (
            <OnlyStackholderWarnStyled mode="warning">
              <IconCaution />
              <span> Only a stackholder of this challenge may resolve it</span>
            </OnlyStackholderWarnStyled>
          )}
        </Fragment>,
        <Button
          key="confirmButton"
          icon={<IconFlag />}
          label="Resolve"
          mode="positive"
          disabled={loading || !walletAddress || !isRuled}
          onClick={resolveChallengeTx}
          title={isRuled ? 'Publish dispute result' : 'Need to be ruled'}
        />,
      ]}
      onClose={closeModal}
      isOpen={opened}
    >
      <Outset gu16>
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <Accordion
              items={[
                [
                  <>
                    {player}
                    <LabelStyled>Player evidence of completion</LabelStyled>
                  </>,
                  <TextFieldInput id="evidenceOfCompletion" value={claim.evidence} isMarkDown />,
                ],
                [
                  <>
                    {challenger}
                    <LabelStyled>Challenge reason</LabelStyled>
                  </>,
                  <TextFieldInput id="challengeReason" value={challenge!.reason} isMarkDown />,
                ],
              ]}
            />
            {finalRuling}
          </>
        )}
      </Outset>
    </ModalBase>
  );
}
