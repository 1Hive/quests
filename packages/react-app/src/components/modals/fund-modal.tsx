import { Button, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop, uniqueId } from 'lodash-es';
import { useRef, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { ENUM_ESTIMATED_TX_TIME_MS, ENUM_TRANSACTION_STATUS } from 'src/constants';
import styled from 'styled-components';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/style.util';
import { QuestModel } from 'src/models/quest.model';
import { useWallet } from 'src/contexts/wallet.context';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { FundModel } from 'src/models/fund.model';
import { FormErrors } from 'src/models/form-errors';
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
  margin: 0 ${GUpx(1)};
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
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { setTransaction } = useTransactionContext();
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const toast = useToast();

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const fundModalTx = async (values: any, setSubmitting: Function) => {
    try {
      setLoading(true);
      const message = 'Sending funds to Quest';
      toast(message);
      setTransaction({
        id: uniqueId(),
        estimatedDuration: ENUM_ESTIMATED_TX_TIME_MS.QuestFunding,
        message,
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
        transactionType: 'QuestFund',
      });
      const txReceipt = await QuestService.fundQuest(
        walletAddress,
        quest.address!,
        values.fundAmount,
        (txHash) => {
          setTransaction(
            (oldTx) =>
              oldTx && {
                ...oldTx,
                hash: txHash,
                status: ENUM_TRANSACTION_STATUS.Pending,
              },
          );
        },
      );
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: txReceipt?.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          },
      );
      if (!txReceipt?.status) throw new Error('Failed to fund quest');
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
      setSubmitting(false);
      setLoading(false);
    }
  };

  const validate = (values: FundModel) => {
    const errors = {} as FormErrors<FundModel>;
    if (!values.fundAmount?.parsedAmount || values.fundAmount.parsedAmount <= 0)
      errors.fundAmount = 'Amount invalid';

    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  return (
    <Formik
      initialValues={
        {
          fundAmount: { parsedAmount: 0, token: quest.rewardToken },
        } as FundModel
      }
      onSubmit={(values, { setSubmitting }) => {
        validate(values); // validate one last time before submiting
        if (isFormValid) {
          fundModalTx(values, setSubmitting);
        }
      }}
      validateOnChange
      validate={validate}
    >
      {({ values, handleSubmit, handleChange, touched, errors }) => (
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
                key="fundAmount"
                askedTokenAmount={values.fundAmount}
                setIsEnoughBalance={setIsEnoughBalance}
              />
            ),
            <Button
              key="buttonFund"
              icon={<GiTwoCoins />}
              type="submit"
              form="form-fund"
              label="Fund"
              mode="strong"
              disabled={loading || !walletAddress || !isEnoughBalance || !isFormValid}
            />,
          ]}
          onClose={closeModal}
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
                tooltip="The amount of the given token"
                onChange={handleChange}
                isLoading={loading}
                value={values.fundAmount}
                error={touched.fundAmount && (errors.fundAmount as string)}
              />
            </Outset>
          </FormStyled>
        </ModalBase>
      )}
    </Formik>
  );
}
