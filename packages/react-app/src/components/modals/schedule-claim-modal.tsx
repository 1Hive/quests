/* eslint-disable no-nested-ternary */
import { Button } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useState, useRef, useMemo } from 'react';
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
import { approveTokenTransaction } from 'src/services/transaction-handler';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { TransactionModel } from 'src/models/transaction.model';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import AmountFieldInput, { AmountFieldInputFormik } from '../field-input/amount-field-input';
import TextFieldInput from '../field-input/text-field-input';
import { Outset } from '../utils/spacer-util';
import CheckboxFieldInput from '../field-input/checkbox-field-input';
import { AddressFieldInput } from '../field-input/address-field-input';
import { WalletBallance } from '../wallet-balance';
import Stepper from '../utils/stepper';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
  padding: ${GUpx(1)};
  padding-bottom: 0;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx(1)};
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
  questTotalBounty?: TokenAmountModel | null;
  claimDeposit: TokenAmountModel;
  onClose?: ModalCallback;
};

export default function ScheduleClaimModal({
  questAddress,
  questTotalBounty,
  claimDeposit,
  onClose = noop,
}: Props) {
  const { walletAddress } = useWallet();
  const [opened, setOpened] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { setTransaction } = useTransactionContext();
  const modalId = useMemo(() => uniqueId('schedule-claim-modal'), []);
  const isMountedRef = useIsMountedRef();

  const closeModal = (succeed: any) => {
    setOpened(false);
    onClose(succeed);
  };

  const validate = (values: ClaimModel & { claimAll: boolean }) => {
    const errors = {} as FormErrors<ClaimModel>;
    if (!values.evidence) errors.evidence = 'Evidence of completion is required';
    if (!values.claimAll) {
      if (values.claimedAmount.parsedAmount < 0) errors.claimedAmount = 'Claim amount is invalid';
      else if (values.claimedAmount.parsedAmount > questTotalBounty!.parsedAmount)
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

  const onClaimSubmit = (values: ClaimModel & { claimAll: boolean }) => {
    validate(values); // Validate one last time before submitting
    if (isFormValid) {
      if (values.claimAll) {
        values.claimedAmount.parsedAmount = 0;
        values.claimedAmount.token.amount = '0';
      }
      scheduleClaimTx(values);
    }
  };

  const scheduleClaimTx = async (values: Partial<ClaimModel>) => {
    try {
      const { governQueueAddress } = getNetwork();
      const scheduleDeposit = (await QuestService.fetchDeposits()).claim;
      await approveTokenTransaction(
        modalId,
        scheduleDeposit.token,
        governQueueAddress,
        'Approving claim deposit (1/2)',
        walletAddress,
        setTransaction,
      );
      const txPayload = {
        modalId,
        estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.ClaimScheduling,
        message: 'Scheduling claim (2/2)',
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
        type: 'ClaimSchedule',
        args: { questAddress },
      } as TransactionModel;
      setTransaction(txPayload);
      const scheduleReceipt = await QuestService.scheduleQuestClaim(
        walletAddress,
        {
          claimedAmount: values.claimedAmount!,
          evidence: values.evidence!,
          playerAddress: values.playerAddress ?? walletAddress,
          claimAll: values.claimAll,
          questAddress,
        },
        (txHash) => {
          setTransaction({
            ...txPayload,
            hash: txHash,
            status: ENUM_TRANSACTION_STATUS.Pending,
          });
        },
      );
      setTransaction({
        ...txPayload,
        status: scheduleReceipt?.status
          ? ENUM_TRANSACTION_STATUS.Confirmed
          : ENUM_TRANSACTION_STATUS.Failed,
      });
      if (!scheduleReceipt?.status)
        throw new Error('Failed to schedule the claim, please retry in a few seconds');
    } catch (e: any) {
      if (isMountedRef.current) {
        setTransaction(
          (oldTx) =>
            oldTx && {
              ...oldTx,
              status: ENUM_TRANSACTION_STATUS.Failed,
              message: computeTransactionErrorMessage(e),
            },
        );
      }
    }
  };

  return (
    <ModalBase
      id={modalId}
      title="Schedule a Quest claim"
      openButton={
        <OpenButtonStyled
          icon={<GiBroadsword />}
          onClick={() => setOpened(true)}
          label="Schedule claim"
          mode="positive"
          title={!questTotalBounty ? 'Loading ...' : 'Open schedule claim'}
          disabled={!questTotalBounty}
        />
      }
      onClose={closeModal}
      isOpen={opened}
    >
      <Formik
        initialValues={
          {
            evidence: '',
            claimedAmount: { parsedAmount: 0, token: questTotalBounty?.token } as TokenAmountModel,
            claimAll: false,
            playerAddress: undefined,
          } as any
        }
        onSubmit={(values) => {
          onClaimSubmit(values);
        }}
        validateOnChange
        validate={validate}
      >
        {({ values, handleSubmit, handleChange, handleBlur, errors, touched, setTouched }) => (
          <FormStyled id="form-claim" onSubmit={handleSubmit} ref={formRef}>
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
                    className="m-8"
                    title={
                      !walletAddress
                        ? 'Not ready ...'
                        : !isFormValid
                        ? 'Form not valid'
                        : 'Schedule claim'
                    }
                    disabled={!isEnoughBalance}
                  />
                </>
              }
              steps={[
                <TextFieldInput
                  id="evidence"
                  isEdit
                  label="Evidence of completion"
                  tooltip="The necessary evidence that will confirm the completion of the quest. Make sure there is enough evidence as it will be useful if this claim is challenged in the future."
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
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
