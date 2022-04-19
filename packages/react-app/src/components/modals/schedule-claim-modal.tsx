import { Button, useToast } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useState, useRef } from 'react';
import { GiBroadsword } from 'react-icons/gi';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { ENUM_TRANSACTION_STATUS, ENUM, DEFAULT_CLAIM_EXECUTION_DELAY_MS } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { ClaimModel } from 'src/models/claim.model';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/style.util';
import { getNetwork } from 'src/networks';
import { useWallet } from 'src/contexts/wallet.context';
import { toChecksumAddress } from 'web3-utils';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';

import { FormErrors } from 'src/models/form-errors';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import AmountFieldInput, { AmountFieldInputFormik } from '../field-input/amount-field-input';
import TextFieldInput from '../field-input/text-field-input';
import { ChildSpacer, Outset } from '../utils/spacer-util';
import CheckboxFieldInput from '../field-input/checkbox-field-input';
import { AddressFieldInput } from '../field-input/address-field-input';
import { WalletBallance } from '../wallet-balance';
import Stepper from '../utils/stepper';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
  padding: ${GUpx()};
  padding-bottom: 0;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
  width: fit-content;
`;

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
`;

// #endregion

type Props = {
  questAddress: string;
  questTotalBounty: TokenAmountModel;
  claimDeposit: TokenAmountModel;
  onClose?: ModalCallback;
};

export default function ScheduleClaimModal({
  questAddress,
  questTotalBounty,
  claimDeposit,
  onClose = noop,
}: Props) {
  const toast = useToast();
  const { walletAddress } = useWallet();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { setTransaction } = useTransactionContext();

  const closeModal = (succeed: any) => {
    setOpened(false);
    onClose(succeed);
  };
  const validate = (values: ClaimModel & { claimAll: boolean }) => {
    const errors = {} as FormErrors<ClaimModel>;
    if (!values.evidence) errors.evidence = 'Evidence of completion is required';
    if (!values.claimAll) {
      if (!values.claimedAmount?.parsedAmount) errors.claimedAmount = 'Claim amount is required';
      else if (values.claimedAmount.parsedAmount < 0)
        errors.claimedAmount = 'Claim amount is invalid';
      else if (values.claimedAmount.parsedAmount > questTotalBounty.parsedAmount)
        errors.claimedAmount = 'Claim amount should not be higher than available bounty';
    }

    if (values.playerAddress) {
      try {
        values.playerAddress = toChecksumAddress(values.playerAddress);
      } catch (error) {
        errors.playerAddress = 'Player address is not valid';
      }
    }
    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };
  const onClaimSubmit = (values: ClaimModel & { claimAll: boolean }, setSubmitting: Function) => {
    validate(values); // Validate one last time before submitting
    if (isFormValid) {
      if (values.claimAll) {
        values.claimedAmount.parsedAmount = 0;
        values.claimedAmount.token.amount = '0';
      }
      scheduleClaimTx(values, setSubmitting);
    }
  };

  const scheduleClaimTx = async (values: Partial<ClaimModel>, setSubmitting: Function) => {
    try {
      setLoading(true);
      const { governQueueAddress } = getNetwork();
      const scheduleDeposit = (await QuestService.fetchDeposits()).claim;
      let message = 'Approving claim deposit';
      toast(message);
      setTransaction({
        id: uniqueId(),
        estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
        message,
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
      });
      const approveTxReceipt = await QuestService.approveTokenAmount(
        walletAddress,
        governQueueAddress,
        scheduleDeposit.token,
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
            status: approveTxReceipt?.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          },
      );
      if (!approveTxReceipt?.status) throw new Error('Failed to approve deposit');
      message = 'Scheduling claim';
      setTransaction({
        id: uniqueId(),
        estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.ClaimScheduling,
        message,
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
      });
      const scheduleReceipt = await QuestService.scheduleQuestClaim(
        walletAddress,
        {
          claimedAmount: values.claimedAmount!,
          evidence: values.evidence!,
          playerAddress: values.playerAddress ?? walletAddress,
          questAddress,
        },
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
            status: scheduleReceipt?.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          },
      );
      if (!scheduleReceipt?.status)
        throw new Error('Failed to schedule the claim, please retry in a few seconds');
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

  return (
    <ModalBase
      id="schedule-claim-modal"
      title="Claim quest"
      openButton={
        <OpenButtonStyled
          icon={<GiBroadsword />}
          onClick={() => setOpened(true)}
          label="Schedule claim"
          mode="positive"
        />
      }
      onClose={closeModal}
      isOpen={opened}
    >
      <Formik
        initialValues={
          {
            evidence: '',
            claimedAmount: { parsedAmount: 0, token: questTotalBounty.token } as TokenAmountModel,
            claimAll: false,
            playerAddress: undefined,
          } as any
        }
        onSubmit={(values, { setSubmitting }) => {
          onClaimSubmit(values, setSubmitting);
        }}
        validateOnChange
        validate={validate}
      >
        {({ values, handleSubmit, handleChange, handleBlur, errors, touched, setTouched }) => (
          <FormStyled id="form-claim" onSubmit={handleSubmit} ref={formRef}>
            <ChildSpacer size={16} justify="start" vertical>
              <Stepper
                onNext={(currentStep: number, _isSubmitStep: boolean) => {
                  const stepErrors = validate(values);

                  if (currentStep === 0) {
                    setTouched({ evidence: true });
                    return !stepErrors.evidence;
                  }
                  if (currentStep === 1) {
                    return !(stepErrors.claimedAmount || stepErrors.playerAddress);
                  }
                  return true;
                }}
                submitButton={
                  <>
                    <AmountFieldInput
                      key="claimDeposit"
                      id="claimDeposit"
                      label="Claim Deposit"
                      tooltip="This amount will be staked when claiming a bounty. If the claim is challenged and ruled in favor of the challenger, you will lose this deposit."
                      isLoading={loading}
                      value={claimDeposit}
                      compact
                    />
                    <WalletBallance
                      key="WalletBallance-claimDeposit"
                      askedTokenAmount={claimDeposit}
                      setIsEnoughBalance={setIsEnoughBalance}
                    />
                    <Button
                      key="confirmButton"
                      icon={<GiBroadsword />}
                      label="Schedule claim"
                      mode="positive"
                      type="submit"
                      form="form-claim"
                      disabled={loading || !walletAddress || !isEnoughBalance || !isFormValid}
                    />
                  </>
                }
                steps={[
                  <TextFieldInput
                    id="evidence"
                    isEdit
                    label="Evidence of completion"
                    tooltip="The necessary evidence that will confirm the completion of the quest. Make sure there is enough evidence as it will be useful if this claim is challenged in the future."
                    isLoading={loading}
                    value={values.evidence}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.evidence && errors.evidence}
                    multiline
                    wide
                    rows={10}
                    compact
                    isMarkDown
                  />,
                  <WrapperStyled>
                    <div className="inline-flex">
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
                          handleBlur={handleBlur}
                          value={values.claimAll}
                          tooltip={`Check this if you want to claim the entire bounty available passed the claim delay of ${DEFAULT_CLAIM_EXECUTION_DELAY_MS}.`}
                          isLoading={loading}
                          isEdit
                        />
                      </Outset>
                    </div>
                    <Outset horizontal>
                      <AmountFieldInputFormik
                        id="claimedAmount"
                        isEdit
                        label="Claim amount"
                        tooltip="The expected amount to claim considering the Quest agreement. Check all bounty if you want to claim all available bounty at the moment the claim is executed."
                        isLoading={loading}
                        value={values.claimAll ? questTotalBounty : values.claimedAmount}
                        error={touched.claimedAmount && (errors.claimedAmount as string)}
                        disabled={values.claimAll}
                      />
                    </Outset>

                    <Outset horizontal>
                      <AddressFieldInput
                        id="playerAddress"
                        label="Player address"
                        value={values.playerAddress ?? walletAddress}
                        isLoading={loading}
                        tooltip="Usually is the connected wallet but it can also be set to another address."
                        error={touched.playerAddress && errors.playerAddress}
                        onBlur={handleBlur}
                        isEdit
                        onChange={handleChange}
                        wide
                      />
                    </Outset>
                  </WrapperStyled>,
                ]}
              />
            </ChildSpacer>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
