import { Button, IconCoin, Timer } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { ReactNode, useEffect, useState } from 'react';
import { ENUM_CLAIM_STATE, ENUM, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { ClaimModel } from 'src/models/claim.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { useWallet } from 'src/contexts/wallet.context';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';
import { AddressFieldInput } from '../field-input/address-field-input';
import { FieldInput } from '../field-input/field-input';

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

// #endregion

type Props = {
  claim: ClaimModel;
  questTotalBounty?: TokenAmountModel | null;
  onClose?: ModalCallback;
};

export default function ExecuteClaimModal({ claim, questTotalBounty, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<TokenAmountModel>();
  const [scheduleTimeout, setScheduleTimeout] = useState<boolean>();
  const [buttonLabel, setButtonLabel] = useState<ReactNode>('Claim');
  const { setTransaction } = useTransactionContext();
  const { walletAddress } = useWallet();
  useEffect(() => {
    let handle: number;
    const launchTimeoutAsync = async (execTimeMs: number) => {
      const now = Date.now();
      if (now >= execTimeMs) setScheduleTimeout(true);
      else {
        setScheduleTimeout(false);
        handle = window.setTimeout(() => {
          setScheduleTimeout(true);
        }, execTimeMs - now); // To ms
      }
      setLoading(false);
    };
    if (claim.executionTimeMs) launchTimeoutAsync(claim.executionTimeMs);
    return () => {
      if (handle) clearTimeout(handle);
    };
  }, []);

  useEffect(() => {
    if (scheduleTimeout === undefined) return;
    if (claim.state === ENUM_CLAIM_STATE.Challenged) setButtonLabel('Challenged by someone');
    else setButtonLabel('Claim');
  }, [claim.state, claim.executionTimeMs, scheduleTimeout]);

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
        id: uniqueId(),
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
      setLoading(false);
    }
  };

  return (
    <>
      <ModalBase
        id="execute-claim-modal"
        title="Claim quest bounty"
        openButton={
          <OpenButtonWrapperStyled>
            {!loading && !scheduleTimeout && claim.executionTimeMs ? (
              <FieldInput label="Claimable in">
                <Timer end={new Date(claim.executionTimeMs)} />
              </FieldInput>
            ) : (
              <OpenButtonStyled
                onClick={() => setOpened(true)}
                icon={<IconCoin />}
                label={buttonLabel}
                mode="positive"
                disabled={
                  loading ||
                  !scheduleTimeout ||
                  claim.state === ENUM_CLAIM_STATE.Challenged ||
                  !questTotalBounty ||
                  !walletAddress
                }
              />
            )}
          </OpenButtonWrapperStyled>
        }
        buttons={
          <Button
            onClick={() => claimTx()}
            icon={<IconCoin />}
            label={buttonLabel}
            disabled={
              loading ||
              !scheduleTimeout ||
              claim.state === ENUM_CLAIM_STATE.Challenged ||
              !walletAddress
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
        </Outset>
      </ModalBase>
    </>
  );
}
