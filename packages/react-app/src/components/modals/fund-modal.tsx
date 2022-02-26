import { Button, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop, uniqueId } from 'lodash-es';
import { useRef, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { ENUM_ESTIMATED_TX_TIME_MS, ENUM_TRANSACTION_STATUS } from 'src/constants';
import styled from 'styled-components';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/css.util';
import { QuestModel } from 'src/models/quest.model';
import { useWallet } from 'src/contexts/wallet.context';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';
import { AddressFieldInput } from '../field-input/address-field-input';
import { WalletBallance } from '../wallet-balance';

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
  width: fit-content;
`;

type Props = {
  onClose?: ModalCallback;
  quest: QuestModel;
};

export default function FundModal({ quest, onClose = noop }: Props) {
  const { walletAddress } = useWallet();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { setTransaction, transaction } = useTransactionContext();
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const toast = useToast();

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const fundModalTx = async (values: any, setSubmitting: Function) => {
    try {
      const id = uniqueId();
      setLoading(true);
      const pendingMessage = 'Sending funds to Quest...';
      toast(pendingMessage);
      setTransaction({
        id,
        estimatedEnd: Date.now() + ENUM_ESTIMATED_TX_TIME_MS.QuestFunding,
        pendingMessage,
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
      });
      const txReceipt = await QuestService.fundQuest(
        walletAddress,
        quest.address!,
        values.fundAmount,
        (txHash) => {
          setTransaction({
            ...transaction,
            status: ENUM_TRANSACTION_STATUS.Pending,
          } as TransactionModel);
        },
      );
      setTransaction({
        id,
        hash: txReceipt?.transactionHash,
        status: txReceipt?.status
          ? ENUM_TRANSACTION_STATUS.Confirmed
          : ENUM_TRANSACTION_STATUS.Failed,
      });
      closeModal(true);
      if (!txReceipt?.status) throw new Error('Failed to fund quest');
      toast('Operation succeed');
    } catch (e: any) {
      setTransaction({
        ...transaction,
        status: ENUM_TRANSACTION_STATUS.Failed,
      } as TransactionModel);
      toast(computeTransactionErrorMessage(e));
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        fundAmount: { parsedAmount: 0, token: quest.rewardToken } as TokenAmountModel,
      }}
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
        <ModalBase
          id="fund-modal"
          title="Fund quest"
          openButton={
            <OpenButtonStyled
              icon={<GiTwoCoins />}
              onClick={() => setOpened(true)}
              label="Fund"
              mode="strong"
            />
          }
          buttons={[
            quest.rewardToken && (
              <WalletBallance
                askedTokenAmount={values.fundAmount}
                setIsEnoughBalance={setIsEnoughBalance}
              />
            ),
            <Button
              icon={<GiTwoCoins />}
              type="submit"
              form="form-fund"
              label="Fund"
              mode="strong"
              disabled={loading || !walletAddress || !isEnoughBalance}
            />,
          ]}
          onClose={() => closeModal(false)}
          isOpen={opened}
          size="small"
        >
          <FormStyled id="form-fund" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <AddressFieldInput
                id="address"
                label="Quest address"
                value={quest.address}
                isLoading={loading}
              />
              <AmountFieldInputFormik
                id="fundAmount"
                isEdit
                label="Amount"
                tooltip="Fund amount"
                tooltipDetail="The amount of given token"
                onChange={handleChange}
                isLoading={loading}
                value={values.fundAmount}
              />
            </Outset>
          </FormStyled>
        </ModalBase>
      )}
    </Formik>
  );
}
