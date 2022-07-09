/* eslint-disable no-nested-ternary */
import { Button, Info } from '@1hive/1hive-ui';
import { debounce, noop, uniqueId } from 'lodash-es';
import { useState, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import {
  ENUM_TRANSACTION_STATUS,
  ENUM,
  DEFAULT_CLAIM_EXECUTION_DELAY_MS,
  ENUM_QUEST_STATE,
} from 'src/constants';
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
import { FaEdit, FaEye, FaMoneyBillWave } from 'react-icons/fa';
import { QuestModel } from 'src/models/quest.model';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import AmountFieldInput, { AmountFieldInputFormik } from '../field-input/amount-field-input';
import TextFieldInput from '../field-input/text-field-input';
import { Outset } from '../utils/spacer-util';
import CheckboxFieldInput from '../field-input/checkbox-field-input';
import { AddressFieldInput } from '../field-input/address-field-input';
import { WalletBallance } from '../wallet-balance';
import Stepper from '../utils/stepper';
import { HelpTooltip } from '../field-input/help-tooltip';

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

const LineStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonLinkStyled = styled(Button)`
  border: none;
  box-shadow: none;
  padding: 0;
  height: fit-content;
  color: ${({ theme }: any) => theme.contentSecondary};
  font-weight: bold;
  background: transparent;
  padding-top: 4px;
`;

const ContactInformationWrapperStyled = styled.div`
  max-width: 406px;
`;

const DepositInfoStyled = styled(Info)`
  padding: ${GUpx(1)};
`;

// #endregion

type Props = {
  questAddress: string;
  questTotalBounty?: TokenAmountModel | null;
  claimDeposit: TokenAmountModel;
  claimData?: ClaimModel;
  questData: QuestModel;
  onClose?: ModalCallback;
};
const emptyClaimData = {
  state: ENUM_QUEST_STATE.Draft,
} as ClaimModel;
export default function ScheduleClaimModal({
  questAddress,
  questTotalBounty,
  claimDeposit,
  claimData = emptyClaimData,
  questData,
  onClose = noop,
}: Props) {
  const { walletAddress } = useWallet();
  const [opened, setOpened] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [claimDataState, setClaimDataState] = useState<ClaimModel>(claimData);
  const formRef = useRef<HTMLFormElement>(null);
  const { setTransaction } = useTransactionContext();
  const modalId = useMemo(() => uniqueId('schedule-claim-modal'), []);
  const isMountedRef = useIsMountedRef();

  const willExpireBeforeClaim = useMemo(
    () => questData.expireTime.getTime() < Date.now() + DEFAULT_CLAIM_EXECUTION_DELAY_MS,
    [questData.expireTime],
  );

  const closeModal = (succeed: any) => {
    setOpened(false);
    onClose(succeed);
  };
  const debounceSave = useCallback(
    debounce((data: ClaimModel) => setClaimDataState(data), 500),
    [], // will be created only once initially
  );

  const validate = (values: ClaimModel) => {
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
    debounceSave(values);
    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  const onClaimSubmit = (values: ClaimModel) => {
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
      let txPayload = {
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
        questData,
        {
          claimedAmount: values.claimedAmount!,
          evidence: values.evidence!,
          contactInformation: values.contactInformation,
          playerAddress: values.playerAddress ?? walletAddress,
          claimAll: values.claimAll,
          questAddress,
        },
        (txHash) => {
          txPayload = { ...txPayload, hash: txHash };
          setTransaction({
            ...txPayload,
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
      if (isMountedRef.current) {
        setClaimDataState(emptyClaimData);
      }
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

  const expirationWarning = (
    <div className="pb-0 pt-32">
      <Info mode="warning">
        <LineStyled>
          ⚠️ The quest will expire before your claim can be executed.
          <HelpTooltip>
            The quest will expire before the claim validation period is over. It will still be
            executable past that point but the quest funds might be withdrawn.
          </HelpTooltip>
        </LineStyled>
      </Info>
    </div>
  );

  return (
    <ModalBase
      id={modalId}
      title="Schedule a Quest claim"
      openButton={
        <OpenButtonStyled
          icon={<FaMoneyBillWave />}
          onClick={() => setOpened(true)}
          label="Claim Quest"
          mode="positive"
          title={!questTotalBounty ? 'Loading ...' : 'Open Quest claim'}
          disabled={!questTotalBounty}
        />
      }
      onClose={closeModal}
      isOpen={opened}
    >
      <Formik
        initialValues={
          {
            evidence: claimDataState.evidence ?? '',
            claimedAmount:
              claimDataState.claimedAmount ??
              ({ parsedAmount: 0, token: questTotalBounty?.token } as TokenAmountModel),
            claimAll: claimDataState.claimAll ?? false,
            contactInformation: claimDataState.contactInformation,
            playerAddress: claimDataState.playerAddress,
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
                  <WalletBallance
                    key="WalletBallance-claimDeposit"
                    askedTokenAmount={claimDeposit}
                    setIsEnoughBalance={setIsEnoughBalance}
                  />
                  <DepositInfoStyled mode={isEnoughBalance ? 'info' : 'warning'} key="claimDeposit">
                    <AmountFieldInput
                      id="claimDeposit"
                      label="Claim Deposit"
                      tooltip="This amount will be staked when claiming a bounty. If the claim is challenged and ruled in favor of the challenger, you will lose this deposit."
                      value={claimDeposit}
                      compact
                    />
                  </DepositInfoStyled>
                  <Button
                    key="confirmButton"
                    icon={<FaMoneyBillWave />}
                    label="Claim Quest"
                    mode="positive"
                    type="submit"
                    form="form-claim"
                    className="m-8"
                    title={!isFormValid ? 'Form not valid' : 'Claim Quest'}
                    disabled={!isEnoughBalance}
                  />
                </>
              }
              steps={[
                <>
                  <TextFieldInput
                    id="evidence"
                    isEdit={!showPreview}
                    label={
                      <LineStyled>
                        Evidence of completion
                        <Outset horizontal>
                          <ButtonLinkStyled
                            size="mini"
                            icon={showPreview ? <FaEdit /> : <FaEye />}
                            display="icon"
                            label={showPreview ? 'Edit' : 'Preview'}
                            onClick={() => setShowPreview((old) => !old)}
                            title={
                              showPreview
                                ? 'Back to edit mode'
                                : 'Show a preview of the evidence of completion'
                            }
                          />
                        </Outset>
                      </LineStyled>
                    }
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
                  />
                  {willExpireBeforeClaim && expirationWarning}
                </>,
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
                      tooltip='The expected amount to claim considering the Quest agreement. Check "Claim All" if you want to claim all available bounty at the moment the claim is executed.'
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
                      tooltip="Usually set to the connected wallet but it can also be set to another address."
                      error={touched.playerAddress && errors.playerAddress}
                      onBlur={handleBlur}
                      isEdit
                      onChange={handleChange}
                      wide
                    />
                  </Outset>
                  <Outset>
                    <ContactInformationWrapperStyled>
                      <TextFieldInput
                        id="contactInformation"
                        isEdit
                        label="Contact information (optional)"
                        tooltip="The necessary contact information that the creator will use to communicate with you. (Optional)"
                        value={values.contactInformation}
                        onChange={handleChange}
                        placeHolder="e.g. discord, email, phone number, etc."
                        compact
                        wide
                        isMarkDown
                      />
                    </ContactInformationWrapperStyled>
                    {willExpireBeforeClaim && expirationWarning}
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
