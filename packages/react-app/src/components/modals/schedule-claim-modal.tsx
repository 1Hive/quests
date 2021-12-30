import { Button, useToast } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useRef } from 'react';
import { GiBroadsword } from 'react-icons/gi';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { DEFAULT_AMOUNT, TRANSACTION_STATUS } from 'src/constants';
import { Logger } from 'src/utils/logger';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { useGovernQueueContract } from 'src/hooks/use-contract.hook';
import { useWallet } from 'src/contexts/wallet.context';
import { ClaimModel } from 'src/models/claim.model';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/css.util';
import ModalBase from './modal-base';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import TextFieldInput from '../shared/field-input/text-field-input';
import { Outset } from '../shared/utils/spacer-util';

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
  claimDeposit?: TokenAmountModel;
  onClose?: Function;
};

export default function ScheduleClaimModal({ questAddress, claimDeposit, onClose = noop }: Props) {
  const toast = useToast();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const governQueueContract = useGovernQueueContract();
  const { pushTransaction, updateTransactionStatus } = useTransactionContext()!;

  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const scheduleClaimTx = async (values: Partial<ClaimModel>, setSubmitting: Function) => {
    try {
      setLoading(true);
      toast('Comming soon...');
      const txReceipt = await QuestService.scheduleQuestClaim(
        governQueueContract,
        {
          claimedAmount: values.claimedAmount!,
          evidence: values.evidence!,
          playerAddress: wallet.account,
          questAddress,
        },
        claimDeposit!,
        (tx) => {
          pushTransaction({
            hash: tx,
            estimatedEnd: Date.now() + 10 * 1000,
            pendingMessage: 'Quest claiming...',
            status: TRANSACTION_STATUS.Pending,
          });
          onModalClose();
        },
      );
      updateTransactionStatus({
        hash: txReceipt.transactionHash,
        status: TRANSACTION_STATUS.Confirmed,
      });
      toast('Operation succeed');
    } catch (e: any) {
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
          isEdit={false}
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
                css={{ height: 100 }}
              />
              <AmountFieldInputFormik
                id="claimedAmount"
                isEdit
                label="Claimed amount"
                tooltip="Claimed amount"
                tooltipDetail="The expected amount to claim considering the quest agreement."
                isLoading={loading}
                value={values.claimedAmount}
              />
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
