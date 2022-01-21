import { Button, useToast } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useRef } from 'react';
import { GiBroadsword } from 'react-icons/gi';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { ENUM_TRANSACTION_STATUS, ENUM } from 'src/constants';
import { Logger } from 'src/utils/logger';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { ClaimModel } from 'src/models/claim.model';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/css.util';
import { getNetwork } from 'src/networks';
import { useWallet } from 'src/contexts/wallet.context';
import { toChecksumAddress } from 'web3-utils';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';
import TextFieldInput from '../field-input/text-field-input';
import { ChildSpacer, Outset } from '../utils/spacer-util';
import CheckboxFieldInput from '../field-input/checkbox-field-input';
import { AddressFieldInput } from '../field-input/address-field-input';
import { ShowBalanceOf } from '../show-balance-of';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
  width: fit-content;
`;

const LineStyled = styled.div`
  display: flex;
  align-content: center;
`;

// #endregion

type Props = {
  questAddress: string;
  questTotalBounty: TokenAmountModel;
  claimDeposit: TokenAmountModel;
  playerAddress: string;
  onClose?: ModalCallback;
};

export default function ScheduleClaimModal({
  questAddress,
  questTotalBounty,
  claimDeposit,
  playerAddress,
  onClose = noop,
}: Props) {
  const toast = useToast();
  const { walletAddress } = useWallet();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext();

  const closeModal = (succeed: any) => {
    setOpened(false);
    onClose(succeed);
  };

  const scheduleClaimTx = async (values: Partial<ClaimModel>, setSubmitting: Function) => {
    try {
      setLoading(true);
      const { governQueueAddress } = getNetwork();
      const scheduleDeposit = (await QuestService.fetchDeposits()).claim;
      if (scheduleDeposit.parsedAmount) {
        toast('Approving claim deposit...');
        const approveTxReceipt = await QuestService.approveTokenAmount(
          walletAddress,
          governQueueAddress,
          scheduleDeposit.token,
          (tx) => {
            pushTransaction({
              hash: tx,
              estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
              pendingMessage: 'Approving claim deposit...',
              status: ENUM_TRANSACTION_STATUS.Pending,
            });
          },
        );
        if (approveTxReceipt) {
          updateTransactionStatus({
            hash: approveTxReceipt.transactionHash,
            status: approveTxReceipt.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          });
        }
        if (!approveTxReceipt?.status) throw new Error('Failed to approve deposit');
      }
      toast('Scheduling claim...');
      const scheduleReceipt = await QuestService.scheduleQuestClaim(
        walletAddress,
        {
          claimedAmount: values.claimedAmount!,
          evidence: values.evidence!,
          playerAddress,
          questAddress,
        },
        (tx) => {
          pushTransaction({
            hash: tx,
            estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.ClaimScheduling,
            pendingMessage: 'Scheduling claim...',
            status: ENUM_TRANSACTION_STATUS.Pending,
          });
        },
      );
      if (scheduleReceipt) {
        updateTransactionStatus({
          hash: scheduleReceipt.transactionHash,
          status: scheduleReceipt.status
            ? ENUM_TRANSACTION_STATUS.Confirmed
            : ENUM_TRANSACTION_STATUS.Failed,
        });
      } else {
        updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
      }
      if (!scheduleReceipt?.status)
        throw new Error('Failed to schedule the claim, please try again in a few seconds');
      toast('Operation succeed');
      closeModal(true);
    } catch (e: any) {
      updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
      Logger.error(e);
      toast(
        e.message.includes('\n') || e.message.length > 50
          ? '💣️ Oops. Something went wrong.'
          : e.message,
      );
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <ModalBase
      title="Claim quest"
      openButton={
        <OpenButtonStyled
          icon={<GiBroadsword />}
          onClick={() => setOpened(true)}
          label="Schedule claim"
          mode="positive"
        />
      }
      buttons={[
        <ShowBalanceOf askedTokenAmount={claimDeposit} setIsEnoughBalance={setIsEnoughBalance} />,
        <AmountFieldInputFormik
          key="claimDeposit"
          id="claimDeposit"
          label="Claim Deposit"
          tooltip="Claim deposit"
          tooltipDetail="This amount will be staked when claiming a bounty. If the claim is successfully challenged, you will lose this deposit."
          isLoading={loading}
          value={claimDeposit}
          compact
        />,
        <Button
          key="confirmButton"
          icon={<GiBroadsword />}
          label="Schedule claim"
          mode="positive"
          type="submit"
          form="form-claim"
          disabled={loading || !walletAddress || !isEnoughBalance}
        />,
      ]}
      onClose={() => closeModal(false)}
      isOpen={opened}
    >
      <Formik
        initialValues={{
          evidence: '',
          claimedAmount: { parsedAmount: 0, token: questTotalBounty.token } as TokenAmountModel,
          claimAll: false,
          playerAddress: walletAddress,
        }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.claimedAmount) errors.push('Validation : Claim amount is required');
          if (values.claimedAmount.parsedAmount > questTotalBounty.parsedAmount)
            errors.push('Validation : Claim amount should not be higher than available bounty');
          if (!values.evidence) errors.push('Validation : Evidence of completion is required');
          try {
            values.playerAddress = toChecksumAddress(values.playerAddress);
          } catch (error) {
            errors.push('Validation : Player address was not set or is not valid');
          }
          if (errors.length) {
            errors.forEach(toast);
          } else {
            scheduleClaimTx(values, setSubmitting);
          }
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <FormStyled id="form-claim" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <ChildSpacer size={16} justify="start" vertical>
                <TextFieldInput
                  id="evidence"
                  isEdit
                  label="Evidence of completion"
                  tooltip="Evidence of completion"
                  tooltipDetail="The necessary evidence that will confirm the completion of the quest. Make sure there is enough evidence as it will be useful if this claim is challenged in the future."
                  isLoading={loading}
                  value={values.evidence}
                  onChange={handleChange}
                  multiline
                  wide
                  rows={5}
                  compact
                />
                <LineStyled>
                  <Outset horizontal>
                    <AmountFieldInputFormik
                      id="questBounty"
                      label="Available bounty"
                      isLoading={loading}
                      value={questTotalBounty}
                    />
                  </Outset>
                  <Outset horizontal>
                    <CheckboxFieldInput
                      id="claimAll"
                      label="Claim all"
                      onChange={handleChange}
                      value={values.claimAll}
                      isLoading={loading}
                      isEdit
                    />
                  </Outset>
                  <Outset horizontal>
                    <AmountFieldInputFormik
                      id="claimedAmount"
                      isEdit
                      label="Claim amount"
                      tooltip="Claim amount"
                      tooltipDetail="The expected amount to claim considering the quest agreement. Set it to 0 if you want to claim the whole bounty."
                      isLoading={loading}
                      value={values.claimAll ? questTotalBounty : values.claimedAmount}
                      disabled={values.claimAll}
                    />
                  </Outset>
                </LineStyled>
                <AddressFieldInput
                  id="playerAddress"
                  label="Player address"
                  value={values.playerAddress}
                  isLoading={loading}
                  tooltip="Player address"
                  tooltipDetail="Most of time it may be be the connected wallet but can also be set to another wallet address"
                  isEdit
                  onChange={handleChange}
                  wide
                />
              </ChildSpacer>
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
