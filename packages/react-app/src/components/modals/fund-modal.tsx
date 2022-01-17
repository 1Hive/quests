import { Button, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useRef, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { ENUM_ESTIMATED_TX_TIME_MS, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useERC20Contract } from 'src/hooks/use-contract.hook';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/css.util';
import { QuestModel } from 'src/models/quest.model';
import { useWallet } from 'src/contexts/wallet.context';
import { TokenModel } from 'src/models/token.model';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
`;

type Props = {
  onClose?: ModalCallback;
  quest: QuestModel;
};

export default function FundModal({ quest, onClose = noop }: Props) {
  const wallet = useWallet();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;
  const toast = useToast();
  const contractERC20 = useERC20Contract(
    typeof quest.rewardToken === 'string' ? quest.rewardToken : quest.rewardToken?.token,
  );

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const fundModalTx = async (values: any, setSubmitting: Function) => {
    try {
      setLoading(true);
      const pendingMessage = 'Sending funds to Quest...';
      toast(pendingMessage);
      const txReceipt = await QuestService.fundQuest(
        wallet.account,
        quest.address!,
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
      closeModal(true);
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
      onClose={() => closeModal(false)}
      isOpen={opened}
      width={500}
    >
      <Formik
        initialValues={{ fundAmount: { parsedAmount: 0, token: quest.rewardToken as TokenModel } }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.fundAmount?.parsedAmount || values.fundAmount.parsedAmount <= 0)
            errors.push('Validation : Amount invalid');
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
                wide
              />
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
