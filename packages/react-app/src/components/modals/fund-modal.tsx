import { Button, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useRef, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { ENUM_ESTIMATED_TX_TIME_MS, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useERC20Contract } from 'src/hooks/use-contract.hook';
import { getNetwork } from 'src/networks';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/css.util';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import { Outset } from '../shared/utils/spacer-util';
import ModalBase from './modal-base';

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
`;

type Props = {
  onClose?: Function;
  questAddress: string;
};

export default function FundModal({ questAddress, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;
  const toast = useToast();
  const { defaultToken } = getNetwork();
  const contractERC20 = useERC20Contract(defaultToken);
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const fundModalTx = async (values: any, setSubmitting: Function) => {
    try {
      setLoading(true);
      const pendingMessage = 'Sending funds to Quest...';
      toast(pendingMessage);
      const txReceipt = await QuestService.fundQuest(
        contractERC20!,
        questAddress,
        values.fundAmount,
        (txHash) => {
          pushTransaction({
            hash: txHash,
            estimatedEnd: Date.now() + ENUM_ESTIMATED_TX_TIME_MS.QuestFunding,
            pendingMessage,
            status: ENUM_TRANSACTION_STATUS.Pending,
          });
        },
      );
      updateTransactionStatus({
        hash: txReceipt.transactionHash!,
        status: txReceipt.status
          ? ENUM_TRANSACTION_STATUS.Confirmed
          : ENUM_TRANSACTION_STATUS.Failed,
      });
      onModalClose();
      if (txReceipt.status) toast('Operation succeed');
    } catch (e: any) {
      updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
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
      title="Fund quest"
      openButton={
        <OpenButtonStyled
          icon={<GiTwoCoins />}
          onClick={() => setOpened(true)}
          label="Fund"
          mode="strong"
        />
      }
      buttons={
        <Button
          icon={<GiTwoCoins />}
          type="submit"
          form="form-fund"
          label="Fund"
          mode="strong"
          disabled={loading || !contractERC20}
        />
      }
      onClose={onModalClose}
      isOpen={opened}
    >
      <Formik
        initialValues={{ fundAmount: { parsedAmount: 0, token: defaultToken } }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.fundAmount?.parsedAmount) errors.push('Validation : Amount is required');
          if (errors.length) {
            errors.forEach(toast);
          } else {
            fundModalTx(values, setSubmitting);
          }
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <FormStyled id="form-fund" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <AmountFieldInputFormik
                id="fundAmount"
                isEdit
                label="Amount"
                onChange={handleChange}
                isLoading={loading}
                value={values.fundAmount}
              />
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
