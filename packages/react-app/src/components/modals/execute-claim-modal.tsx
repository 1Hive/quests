/* eslint-disable no-nested-ternary */
import { Button, IconCoin, IconCaution, Info } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ENUM_CLAIM_STATE, ENUM, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { ClaimModel } from 'src/models/claim.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { useWallet } from 'src/contexts/wallet.context';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { compareCaseInsensitive } from 'src/utils/string.util';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';
import { AddressFieldInput } from '../field-input/address-field-input';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx(1)};
  margin-bottom: ${GUpx(1)};
  width: fit-content;
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const OnlyStackholderWarnStyled = styled(Info)`
  padding: ${GUpx(1)};
  margin-top: ${GUpx(4)};
  display: flex;
  align-items: center;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  questTotalBounty?: TokenAmountModel | null;
  isClaimable?: boolean;
  onClose?: ModalCallback;
};

export default function ExecuteClaimModal({
  claim,
  questTotalBounty,
  isClaimable,
  onClose = noop,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<TokenAmountModel>();
  const [buttonLabel, setButtonLabel] = useState<ReactNode>('Claim');
  const { setTransaction, transaction } = useTransactionContext();
  const { walletAddress } = useWallet();
  const modalId = useMemo(() => uniqueId('execute-claim-modal'), []);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (isClaimable === undefined) return;
    if (claim.state === ENUM_CLAIM_STATE.Challenged) setButtonLabel('Challenged by someone');
    else setButtonLabel('Claim');
  }, [claim.state, claim.executionTimeMs, isClaimable]);

  useEffect(() => {
    if (questTotalBounty) {
      if (claim.claimAll) setAmount(questTotalBounty);
      else setAmount(claim.claimedAmount); // Claim all funds
    }
  }, [claim.claimedAmount, questTotalBounty]);

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const claimTx = async () => {
    try {
      setLoading(true);
      setTransaction({
        modalId,
        estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.ClaimExecuting,
        message: 'Sending claimed amount to your wallet',
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
        type: 'ClaimExecute',
        args: { questAddress: claim.questAddress, containerId: claim.container!.id },
      });
      const txReceipt = await QuestService.executeQuestClaim(walletAddress, claim, (txHash) => {
        setTransaction(
          (oldTx) =>
            oldTx && {
              ...oldTx,
              hash: txHash,
              status: ENUM_TRANSACTION_STATUS.Pending,
            },
        );
      });
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: txReceipt?.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          },
      );
      if (!txReceipt?.status) throw new Error('Failed to execute claim');
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
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <ModalBase
        id={modalId}
        title="Claim quest bounty"
        openButton={
          <OpenButtonWrapperStyled>
            <OpenButtonStyled
              onClick={() => setOpened(true)}
              icon={<IconCoin />}
              label={buttonLabel}
              mode="positive"
              title={
                !isClaimable
                  ? 'Wait for the delay period to end before claiming...'
                  : questTotalBounty &&
                    claim.claimedAmount.parsedAmount >= questTotalBounty.parsedAmount
                  ? 'Not enough funds in Quest to claim'
                  : 'Open quest claim'
              }
              disabled={
                !questTotalBounty ||
                !walletAddress ||
                !isClaimable ||
                claim.claimedAmount.parsedAmount >= questTotalBounty.parsedAmount
              }
            />
          </OpenButtonWrapperStyled>
        }
        buttons={
          <Button
            onClick={claimTx}
            icon={<IconCoin />}
            label={buttonLabel}
            disabled={
              loading ||
              !walletAddress ||
              !isClaimable ||
              claim.state === ENUM_CLAIM_STATE.Challenged ||
              !!transaction
            }
            title={
              loading || !walletAddress || !isClaimable
                ? 'Not ready ...'
                : transaction
                ? 'Wait for previous transaction to complete'
                : 'Trigger claim operation in the chain'
            }
            mode="positive"
          />
        }
        onClose={closeModal}
        isOpen={opened}
        size="small"
      >
        <Outset gu16>
          <AmountFieldInputFormik
            id="bounty"
            label="Claim amount"
            isLoading={loading}
            value={amount}
          />
          <AddressFieldInput
            id="playerAddress"
            label="will be sent to"
            isLoading={loading}
            value={claim.playerAddress}
          />
          {!compareCaseInsensitive(claim.playerAddress, walletAddress) && (
            <OnlyStackholderWarnStyled mode="warning">
              <IconCaution />
              <span>Only the player may execute the claim</span>
            </OnlyStackholderWarnStyled>
          )}
        </Outset>
      </ModalBase>
    </>
  );
}
