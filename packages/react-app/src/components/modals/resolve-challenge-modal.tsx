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
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Logger } from 'src/utils/logger';
import { ClaimModel } from 'src/models/claim.model';
import { ENUM, ENUM_DISPUTE_STATES, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ChallengeModel } from 'src/models/challenge.model';
import { GUpx } from 'src/utils/css.util';
import { useWallet } from 'src/contexts/wallet.context';
import Skeleton from 'react-loading-skeleton';
import ModalBase from './modal-base';
import { useCelesteContract, useGovernQueueContract } from '../../hooks/use-contract.hook';
import * as QuestService from '../../services/quest.service';
import { Outset } from '../shared/utils/spacer-util';
import { DisputeModel } from '../../models/dispute.model';
import TextFieldInput from '../shared/field-input/text-field-input';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx()};
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

const OnlySHWarn = styled(Info)`
  padding: ${GUpx()};
  display: flex;
  align-items: center;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  onClose?: Function;
};

export default function ResolveChallengeModal({ claim, onClose = noop }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [isRuled, setRuled] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeModel | null>();
  const [dispute, setDispute] = useState<DisputeModel>();
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;
  const governQueueContract = useGovernQueueContract();
  const celesteContract = useCelesteContract();
  const wallet = useWallet();

  useEffect(() => {
    const fetchChallengeAndDispute = async () => {
      if (celesteContract) {
        if (!claim.container) throw new Error('Container is required to fetch challenge disputes');
        const challengeResult = await QuestService.fetchChallenge(claim.container);
        setChallenge(challengeResult);
        if (challengeResult) {
          setDispute(await QuestService.fetchChallengeDispute(celesteContract, challengeResult));
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

  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const resolveChallengeTx = async () => {
    try {
      setLoading(true);
      if (!claim.container) throw new Error('Container is not defined');
      const pendingMessage = 'Resolving claim challenge...';
      toast(pendingMessage);
      const challengeTxReceipt = await QuestService.resolveClaimChallenge(
        governQueueContract,
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
      updateTransactionStatus({
        hash: challengeTxReceipt.transactionHash!,
        status: challengeTxReceipt.status
          ? ENUM_TRANSACTION_STATUS.Confirmed
          : ENUM_TRANSACTION_STATUS.Failed,
      });
      if (!challengeTxReceipt.status) throw new Error('Failed to challenge the quest');
      toast('Operation succeed');
      onModalClose();
    } catch (e: any) {
      updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
      Logger.error(e);
      toast(
        e.message.includes('\n') || e.message.length > 75
          ? 'Oops. Something went wrong.'
          : e.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const player = (
    <IdentityBadge
      customLabel="Player"
      entity={claim?.playerAddress}
      connectedAccount={claim?.playerAddress === wallet.acccount}
    />
  );

  const challenger = (
    <IdentityBadge
      customLabel="Challenger"
      entity={challenge?.challengerAddress}
      connectedAccount={challenge?.challengerAddress === wallet.acccount}
    />
  );

  const finalRuling = (
    <FinalRulingWrapper>
      {dispute?.state && (
        <RulingInfoStyled mode={isRuled ? 'info' : 'warning'}>
          <FinalRulingStyled>
            {isRuled ? (
              'Final ruling in favor of'
            ) : (
              <>
                Ruling in progress, please come back later...{' '}
                <Link href={`https://celeste.1hive.org/#/disputes/${dispute.id}`}>See dispute</Link>
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
        // challenge && (
        <OpenButtonWrapperStyled>
          <OpenButtonStyled
            icon={<IconFlag />}
            onClick={() => setOpened(true)}
            label="Resolve"
            mode="positive"
            disabled={loading || !dispute || !governQueueContract || !celesteContract}
          />
        </OpenButtonWrapperStyled>
        // )
      }
      buttons={[
        <>
          {isRuled && (
            <OnlySHWarn mode="warning">
              <IconCaution />
              <span> Only a stackholder of this challenge may resolve it</span>
            </OnlySHWarn>
          )}
        </>,
        <Button
          key="confirmButton"
          icon={<IconFlag />}
          label="Resolve"
          mode="positive"
          disabled={loading || !wallet.account || !isRuled}
          onClick={resolveChallengeTx}
          title={isRuled ? 'Publish dispute result' : 'Need to be ruled'}
        />,
      ]}
      onClose={onModalClose}
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
