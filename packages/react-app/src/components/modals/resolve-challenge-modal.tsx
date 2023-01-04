/* eslint-disable no-nested-ternary */
import { Button, IconFlag, IdentityBadge, Info, Link, IconCaution } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useState, useEffect, Fragment, useMemo } from 'react';
import styled from 'styled-components';
import { ClaimModel } from 'src/models/claim.model';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ChallengeModel } from 'src/models/challenge.model';
import { GUpx } from 'src/utils/style.util';
import { useWallet } from 'src/contexts/wallet.context';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { TransactionModel } from 'src/models/transaction.model';
import Skeleton from 'react-loading-skeleton';
import { ContainerModel } from 'src/models/govern.model';
import { sleep } from 'src/utils/common.util';
import { getNetwork } from 'src/networks';
import { Logger } from 'src/utils/logger';
import { DisputeStatus } from 'src/enums/dispute-status.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { ClaimStatus } from 'src/enums/claim-status.enum';
import { QuestModel } from 'src/models/quest.model';
import { TransactionType } from 'src/enums/transaction-type.enum';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import { Outset } from '../utils/spacer-util';
import { DisputeModel } from '../../models/dispute.model';
import TextFieldInput from '../field-input/text-field-input';
import { HelpTooltip } from '../field-input/help-tooltip';
import { CollapsableBlock } from '../collapsable-block';

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
  margin-left: ${GUpx(2)};
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
  questData: QuestModel;
  claim: ClaimModel;
  onClose?: ModalCallback;
};

export default function ResolveChallengeModal({ claim, questData, onClose = noop }: Props) {
  const { walletAddress, walletConnected } = useWallet();
  const { networkId } = getNetwork();
  const [opened, setOpened] = useState(false);
  const [isRuled, setRuled] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeModel | null>();
  const [dispute, setDispute] = useState<DisputeModel>();
  const [isStackholder, setIsStackholder] = useState(false);
  const { setTransaction } = useTransactionContext();
  const [evidence, setEvidence] = useState<string>();
  const modalId = useMemo(() => uniqueId('resolve-challenge-modal'), []);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    fetchEvidence();
  }, []);

  useEffect(() => {
    const fetchChallengeAndDispute = async (container: ContainerModel, retryCount: number = 5) => {
      const challengeResult = await QuestService.fetchChallenge(container, questData);
      if (!isMountedRef.current) return;
      if (!challengeResult) {
        if (retryCount > 0) {
          await sleep(1000);
          await fetchChallengeAndDispute(container, retryCount - 1);
        } else {
          throw new Error(`Failed to fetch challenge with container id : ${container.id}\n`);
        }
      } else {
        setChallenge(challengeResult);
        if (challengeResult) {
          try {
            const disputeModel = await QuestService.fetchChallengeDispute(challengeResult);
            setDispute(disputeModel ?? undefined);
          } catch (error) {
            Logger.error(
              `Failed to fetch challenge dispute with id : ${challengeResult.disputeId}\n`,
              error,
            );
          }
        }
      }
    };
    if (claim.container) {
      fetchChallengeAndDispute(claim.container);
    }
  }, [claim.container]);

  useEffect(() => {
    if (dispute?.state !== undefined)
      setRuled(
        dispute.state === DisputeStatus.DisputeRuledForChallenger ||
          dispute.state === DisputeStatus.DisputeRuledForSubmitter,
      );
  }, [dispute?.state]);

  useEffect(() => {
    if (challenge && claim) {
      setIsStackholder(
        challenge.challengerAddress === walletAddress || claim.playerAddress === walletAddress,
      );
    }
  }, [claim, challenge, walletAddress]);

  const resolveChallengeTx = async () => {
    try {
      if (!claim.container) throw new Error('Container is not defined');
      const message = 'Resolving claim challenge';
      let txPayload: TransactionModel = {
        modalId,
        message,
        status: TransactionStatus.WaitingForSignature,
        type: TransactionType.ClaimChallengeResolve,
        args: {
          questAddress: claim.questAddress,
          containerId: claim.container.id,
          disputeState: dispute!.state,
        },
      };
      setTransaction(txPayload);
      const challengeTxReceipt = await QuestService.resolveClaimChallenge(
        walletAddress,
        questData,
        claim.container,
        dispute!,
        (txHash) => {
          txPayload = { ...txPayload, hash: txHash };
          setTransaction({
            ...txPayload,
            status: TransactionStatus.Pending,
          });
        },
      );
      setTransaction({
        ...txPayload,
        status: challengeTxReceipt?.status ? TransactionStatus.Confirmed : TransactionStatus.Failed,
      });
      if (!challengeTxReceipt?.status) throw new Error('Failed to challenge the quest');
    } catch (e: any) {
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: TransactionStatus.Failed,
            message: computeTransactionErrorMessage(e),
          },
      );
    }
  };

  const fetchEvidence = async () => {
    const claimInfo = await QuestService.fetchClaimIpfsInfo(claim.claimInfoIpfsHash);
    if (isMountedRef.current) {
      setEvidence(claimInfo.evidence);
    }
  };

  const onModalClosed = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const player = useMemo(
    () => (
      <IdentityBadge
        customLabel="Player"
        entity={claim?.playerAddress}
        connectedAccount={claim?.playerAddress === walletAddress}
      />
    ),
    [claim?.playerAddress, walletAddress],
  );

  const challenger = useMemo(
    () => (
      <IdentityBadge
        customLabel="Challenger"
        entity={challenge?.challengerAddress}
        connectedAccount={challenge?.challengerAddress === walletAddress}
      />
    ),
    [challenge?.challengerAddress, walletAddress],
  );

  const finalRuling = useMemo(
    () => (
      <FinalRulingWrapper>
        {dispute?.state !== undefined && (
          <RulingInfoStyled mode={isRuled ? 'info' : 'warning'}>
            <FinalRulingStyled>
              {isRuled ? (
                'Ruled in favor of'
              ) : (
                <>
                  Ruling in progress, please come back later...
                  {networkId === 'xdai' ? (
                    <LinkStyled
                      external
                      href={`https://celeste.1hive.org/#/disputes/${dispute.id}`}
                    >
                      See dispute #{dispute.id}
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
            {dispute.state === DisputeStatus.DisputeRuledForChallenger && challenger}
            {dispute.state === DisputeStatus.DisputeRuledForSubmitter && player}
          </RulingInfoStyled>
        )}
      </FinalRulingWrapper>
    ),
    [isRuled, dispute?.state, player, challenger],
  );

  return (
    <ModalBase
      id={modalId}
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
            title={!dispute ? 'Loading...' : 'Open resolve'}
            disabled={!dispute}
          />
        </OpenButtonWrapperStyled>
      }
      buttons={
        claim?.state === ClaimStatus.Challenged && [
          <Fragment key="warnMessage">
            {isRuled && !isStackholder && (
              <OnlyStackholderWarnStyled mode="warning">
                <IconCaution />
                <Outset>
                  Anyone can apply the dispute ruling result. If you are not a stakeholder, consider
                  contacting them.
                </Outset>
              </OnlyStackholderWarnStyled>
            )}
          </Fragment>,
          <Button
            key="confirmButton"
            icon={<IconFlag />}
            label="Resolve"
            mode="positive"
            disabled={!walletConnected || !isRuled || claim.state !== ClaimStatus.Challenged}
            onClick={resolveChallengeTx}
            title={
              !isRuled
                ? 'Need to be ruled in celeste'
                : !walletConnected
                ? 'Not ready ...'
                : 'Publish dispute result'
            }
          />,
        ]
      }
      onModalClosed={onModalClosed}
      isOpened={opened}
    >
      <Outset gu16>
        <>
          {!challenge || !evidence ? (
            <Skeleton />
          ) : (
            <>
              <CollapsableBlock
                hideState
                visible
                copyable={false}
                collapsed
                wide
                header={
                  <>
                    {player}
                    <LabelStyled>Player evidence of completion</LabelStyled>
                  </>
                }
              >
                <TextFieldInput id="evidenceOfCompletion" value={evidence} isMarkDown />
              </CollapsableBlock>
              <CollapsableBlock
                hideState
                visible
                copyable={false}
                collapsed
                wide
                header={
                  <>
                    {challenger}
                    <LabelStyled>Challenge reason</LabelStyled>
                  </>
                }
              >
                <TextFieldInput id="challengeReason" value={challenge.reason} isMarkDown />
              </CollapsableBlock>
            </>
          )}
          {finalRuling}
        </>
      </Outset>
    </ModalBase>
  );
}
