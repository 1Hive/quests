import { Button, useToast } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useRef } from 'react';
import { GiBroadsword } from 'react-icons/gi';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { DEFAULT_AMOUNT, TRANSACTION_STATUS, ENUM } from 'src/constants';
import { Logger } from 'src/utils/logger';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { useERC20Contract, useGovernQueueContract } from 'src/hooks/use-contract.hook';
import { ClaimModel } from 'src/models/claim.model';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/css.util';
import { getNetwork } from 'src/networks';
import ModalBase from './modal-base';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import TextFieldInput from '../shared/field-input/text-field-input';
import { ChildSpacer, Outset } from '../shared/utils/spacer-util';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
`;

// #endregion

type Props = {
  questAddress: string;
  questTotalBounty: TokenAmountModel;
  claimDeposit: TokenAmountModel;
  playerAddress: string;
  onClose?: Function;
};

export default function ScheduleClaimModal({
  questAddress,
  questTotalBounty,
  claimDeposit,
  playerAddress,
  onClose = noop,
}: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const governQueueContract = useGovernQueueContract();
  const erc20Contract = useERC20Contract(claimDeposit!.token!);
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;

  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const scheduleClaimTx = async (values: Partial<ClaimModel>, setSubmitting: Function) => {
    try {
      setLoading(true);
      const container = await QuestService.computeContainer({
        claimedAmount: values.claimedAmount!,
        evidence: values.evidence!,
        playerAddress,
        questAddress,
      });
      const { governQueue } = getNetwork();
      const approveTxReceipt = await QuestService.approveTokenAmount(
        erc20Contract,
        governQueue,
        container.config.scheduleDeposit,
        (tx) => {
          pushTransaction({
            hash: tx,
            estimatedEnd: Date.now() + ENUM.ESTIMATED_TX_TIME_MS.TokenAproval,
            pendingMessage: 'Claim deposit approval...',
            status: TRANSACTION_STATUS.Pending,
          });
        },
      );
      updateTransactionStatus({
        hash: approveTxReceipt.transactionHash,
        status: approveTxReceipt.status ? TRANSACTION_STATUS.Confirmed : TRANSACTION_STATUS.Failed,
      });
      if (approveTxReceipt.status) {
        const scheduleReceipt = await QuestService.scheduleQuestClaim(
          governQueueContract,
          container,
          (tx) => {
            pushTransaction({
              hash: tx,
              estimatedEnd: Date.now() + ENUM.ESTIMATED_TX_TIME_MS.ClaimScheduling,
              pendingMessage: 'Quest claim scheduling...',
              status: TRANSACTION_STATUS.Pending,
            });
          },
        );
        updateTransactionStatus({
          hash: scheduleReceipt.transactionHash,
          status: scheduleReceipt.status ? TRANSACTION_STATUS.Confirmed : TRANSACTION_STATUS.Failed,
        });
        if (scheduleReceipt.status) toast('Operation succeed');
      }
      onModalClose();
    } catch (e: any) {
      updateLastTransactionStatus(TRANSACTION_STATUS.Failed);
      Logger.error(e);
      toast(
        e.message.includes('\n') || e.message.length > 50
          ? 'Oops. Something went wrong.'
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
          disabled={loading || !governQueueContract || !erc20Contract}
        />,
      ]}
      onClose={onModalClose}
      isOpen={opened}
    >
      <Formik
        initialValues={{ evidence: '', claimedAmount: DEFAULT_AMOUNT }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.claimedAmount) errors.push('Validation : Claimed amount is required');
          if (!values.evidence) errors.push('Validation : Evidence of completion is required');
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
              />
              <ChildSpacer size={64}>
                <AmountFieldInputFormik
                  id="claimedAmount"
                  isEdit
                  label="Claimed amount"
                  tooltip="Claimed amount"
                  tooltipDetail="The expected amount to claim considering the quest agreement."
                  isLoading={loading}
                  value={values.claimedAmount}
                />
                <AmountFieldInputFormik
                  id="questBounty"
                  label="Available bounty"
                  isLoading={loading}
                  value={questTotalBounty}
                />
              </ChildSpacer>
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
