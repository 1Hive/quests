import {
  Button,
  useToast,
  IconFlag,
  Accordion,
  IdentityBadge,
  Info,
  Link,
  IconCaution,
} from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { ClaimModel } from 'src/models/claim.model';
import { ENUM, ENUM_DISPUTE_STATES, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ChallengeModel } from 'src/models/challenge.model';
import { GUpx } from 'src/utils/css.util';
import { useWallet } from 'src/contexts/wallet.context';
import Skeleton from 'react-loading-skeleton';
import { getCelesteContract, getGovernQueueContract } from 'src/utils/contract.util';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import { Outset } from '../utils/spacer-util';
import { DisputeModel } from '../../models/dispute.model';
import TextFieldInput from '../field-input/text-field-input';
import { IconTooltip } from '../field-input/icon-tooltip';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx()};
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
  margin-left: ${GUpx()};
`;

const FinalRulingStyled = styled.span`
  margin-right: ${GUpx()};
  margin-top: ${GUpx(0.5)};
`;

const FinalRulingWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${GUpx(4)};
`;

const RulingInfoStyled = styled(Info)`
  width: 100%;
`;

const OnlyStackholderWarn = styled(Info)`
  padding: ${GUpx()};
  display: flex;
  align-items: center;
`;

const LinkStyled = styled(Link)`
  margin-left: ${GUpx()};
`;

// #endregion

type Props = {
  claim: ClaimModel;
  onClose?: ModalCallback;
};

export default function ResolveChallengeModal({ claim, onClose = noop }: Props) {
  const toast = useToast();
  const { walletAddress } = useWallet();
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [isRuled, setRuled] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeModel | null>();
  const [dispute, setDispute] = useState<DisputeModel>();
  const [isStackholder, setIsStackholder] = useState(false);
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext();
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
      const pendingMessage = 'Resolving claim challenge...';
      toast(pendingMessage);
      const challengeTxReceipt = await QuestService.resolveClaimChallenge(
        walletAddress,
        claim.container,
        dispute!,
        (tx) => {
          pushTransaction({
            hash: tx,
            estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.ChallengeResolving,
            pendingMessage,
            status: ENUM_TRANSACTION_STATUS.Pending,
          });
        },
      );
      if (challengeTxReceipt) {
        updateTransactionStatus({
          hash: challengeTxReceipt.transactionHash!,
          status: challengeTxReceipt.status
            ? ENUM_TRANSACTION_STATUS.Confirmed
            : ENUM_TRANSACTION_STATUS.Failed,
        });
      }
      if (!challengeTxReceipt?.status) throw new Error('Failed to challenge the quest');
      toast('Operation succeed');
      closeModal(true);
    } catch (e: any) {
      updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
      toast(computeTransactionErrorMessage(e));
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
                {process.env.NODE_ENV === 'production' ? (
                  <LinkStyled
                    external
                    href={
                      process.env.NODE_ENV === 'production' &&
                      `https://celeste.1hive.org/#/disputes/${dispute.id}`
                    }
                  >
                    See dispute
                  </LinkStyled>
                ) : (
                  <IconTooltip
                    tooltipDetail={`This is a mocked celeste dispute with id ${dispute.id}`}
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
            <OnlyStackholderWarn mode="warning">
              <IconCaution />
              <span> Only a stackholder of this challenge may resolve it</span>
            </OnlyStackholderWarn>
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
      onClose={() => closeModal(false)}
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
                    <LabelStyled>Challenger reason</LabelStyled>
                  </>,
                  <TextFieldInput id="evidenceOfCompletion" value={challenge!.reason} isMarkDown />,
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
