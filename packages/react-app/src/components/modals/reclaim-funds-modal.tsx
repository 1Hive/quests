import { Button, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useRef, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { DEFAULT_AMOUNT, TRANSACTION_STATUS } from 'src/constants';
import { useERC20Contract } from 'src/hooks/use-contract.hook';
import { getNetwork } from 'src/networks';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import { useTransactionContext } from 'src/contexts/transaction.context';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import { Outset } from '../shared/utils/spacer-util';
import ModalBase from './modal-base';

type Props = {
  onClose?: Function;
  questAddress: string;
};

const FormStyled = styled(Form)`
  width: 100%;
`;

export default function ReclaimFundModal({questAddress, bounty, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { pushTransaction, updateTransactionStatus } = useTransactionContext()!;
  const toast = useToast();
  const { defaultToken } = getNetwork();
  const contractERC20 = useERC20Contract(defaultToken);
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const reclaimFundModalTx = async (values: any, setSubmitting: Function) => {
    try {
      setLoading(true);
      const txReceiptReclaim = await QuestService.reclaimUnusedFunds(questContract, (tx) => {
        pushTransaction({
          hash: tx,
          estimatedEnd: Date.now() + 10 * 1000, // 10 sec
          pendingMessage: 'Reclaiming unused fund...',
          status: TRANSACTION_STATUS.Pending,
        });
        onSave();
      });
      updateTransactionStatus({
        hash: txReceiptReclaim.transactionHash,
        status: TRANSACTION_STATUS.Confirmed,
      });
      toast('Fund Reclaimed successfully');
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
      title="Fund quest"
      openButton={
        <Button
                      onClick={() => setOpened(true)
                      icon={<IconCoin />}
                      label="Reclaim funds"
                      wide
                      mode="strong"
                    />
        <Button icon={<GiTwoCoins />} onClick={() => setOpened(true)} label="Fund" mode="strong" />
      }
      buttons={
        <Button
                      onClick={() => reclaimFundModalTx)
                      icon={<IconCoin />}
                      label="Reclaim funds"
                      wide
                      mode="strong"
                    />
        <Button icon={<GiTwoCoins />} type="submit" form="form-fund" label="Fund" mode="strong" />
      }
      onClose={onModalClose}
      isOpen={opened}
    >
      <Formik
        initialValues={{ fundAmount: DEFAULT_AMOUNT }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.fundAmount?.amount) errors.push('Validation : Amount is required');
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
