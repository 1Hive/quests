import { Button, IconPlus, useTheme } from '@1hive/1hive-ui';
import { debounce, noop, uniqueId } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ENUM,
  ENUM_QUEST_STATE,
  ENUM_QUEST_VIEW_MODE,
  ENUM_TRANSACTION_STATUS,
  MAX_LINE_DESCRIPTION,
} from 'src/constants';
import { QuestModel } from 'src/models/quest.model';
import styled from 'styled-components';
import * as QuestService from 'src/services/quest.service';
import { getNetwork } from 'src/networks';
import { Form, Formik, FormikErrors } from 'formik';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { toChecksumAddress } from 'web3-utils';
import { useWallet } from 'src/contexts/wallet.context';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { IN_A_WEEK_IN_MS } from 'src/utils/date.utils';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { approveTokenTransaction, fundQuestTransaction } from 'src/services/transaction-handler';
import ModalBase, { ModalCallback } from './modal-base';
import Stepper from '../utils/stepper';
import { DateFieldInputFormik } from '../field-input/date-field-input';
import AmountFieldInput, { AmountFieldInputFormik } from '../field-input/amount-field-input';
import { AddressFieldInput } from '../field-input/address-field-input';
import TextFieldInput from '../field-input/text-field-input';
import { WalletBallance } from '../wallet-balance';
import { feedDummyQuestData } from '../utils/debug-util';

// #region StyledComponents

const ButtonLinkStyled = styled(Button)`
  border: none;
  box-shadow: none;
  padding: 0;
  height: fit-content;
  color: ${({ theme }: any) => theme.contentSecondary};
  font-weight: bold;
  background: transparent;
`;

const FormStyled = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  #description {
    height: 200px;
  }
`;

// #endregion

type Props = {
  questData?: QuestModel;
  onClose?: ModalCallback;
  questMode: string;
  buttonMode?: 'link' | 'strong' | 'normal' | 'icon' | 'label';
};

const emptyQuestData = {
  expireTime: new Date(IN_A_WEEK_IN_MS + 24 * 36000),
  state: ENUM_QUEST_STATE.Draft,
} as QuestModel;

export default function QuestModal({
  questData = emptyQuestData,
  onClose = noop,
  questMode = ENUM_QUEST_VIEW_MODE.ReadSummary,
  buttonMode = 'normal',
}: Props) {
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('');
  const { walletAddress } = useWallet();
  const { questFactoryAddress } = getNetwork();
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const { setTransaction } = useTransactionContext();
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const [questDataState, setQuestDataState] = useState<QuestModel>(questData);
  const [questDeposit, setQuestDeposit] = useState<TokenAmountModel | null>();
  let mounted = true;
  const modalId = useMemo(() => uniqueId('quest-modal'), []);

  useEffect(() => {
    feedDummyQuestData(questData).then((data) => {
      if (mounted) {
        setQuestDataState(data);
      }
    });

    QuestService.fetchCreateQuestDeposit(walletAddress).then((deposit) => {
      if (mounted) {
        setQuestDeposit(deposit);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    switch (questMode) {
      case ENUM_QUEST_VIEW_MODE.Create:
        setButtonLabel('Create quest');
        break;

      case ENUM_QUEST_VIEW_MODE.Update:
        setButtonLabel('Update quest');
        break;

      case ENUM_QUEST_VIEW_MODE.ReadDetail:
        setButtonLabel('Details');
        break;

      default:
        break;
    }
  }, [questMode]);

  const onOpenButtonClick = () => {
    setOpened(true);
  };

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const debounceSave = useCallback(
    debounce((data: QuestModel) => setQuestDataState(data), 500),
    [], // will be created only once initially
  );

  const validate = (data: QuestModel) => {
    const errors = {} as FormikErrors<QuestModel>;
    if (!data.title) {
      errors.title = 'Title is required';
    }
    if (!data.description) {
      errors.description = 'Description is required';
    }

    if (data.fallbackAddress) {
      try {
        data.fallbackAddress = toChecksumAddress(data.fallbackAddress);
      } catch (error) {
        errors.fallbackAddress = 'Player address is not valid';
      }
    }

    // If bounty is not set then amount can't be invalid because disabled
    if (!data.bounty?.token) errors.bounty = 'Bounty token is required';
    else if (data.bounty.parsedAmount < 0) errors.bounty = ' Invalid initial bounty';

    if (data.expireTime.getTime() < Date.now())
      errors.expireTime = 'Expiration have to be later than now';

    debounceSave(data);

    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  const onQuestSubmit = async (values: QuestModel) => {
    validate(values); // Validate one last time before submitting
    if (isFormValid && questDeposit?.token) {
      await approveTokenTransaction(
        modalId,
        questDeposit?.token,
        questFactoryAddress,
        `Approving quest deposit (1/${values.bounty?.parsedAmount ? '3' : '2'})`,
        walletAddress,
        setTransaction,
      );

      let newQuestAddress: string;
      try {
        setTransaction({
          modalId,
          estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestCreating,
          message: `Creating Quest (2/${values.bounty?.parsedAmount ? '3' : '2'})`,
          status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
          type: 'QuestCreate',
        });
        const txReceiptSaveQuest = await QuestService.saveQuest(
          walletAddress,
          values.fallbackAddress ?? walletAddress,
          {
            ...values,
            expireTime: values.expireTime,
            creatorAddress: walletAddress,
            rewardToken: values.bounty!.token,
          },
          undefined,
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

        newQuestAddress = txReceiptSaveQuest?.events?.flatMap((x) => x.args).filter((x) => !!x)[0];
        if (!newQuestAddress) throw Error('Something went wrong, Quest was not created');

        setTransaction(
          (oldTx) =>
            oldTx && {
              ...oldTx,
              status: txReceiptSaveQuest?.status
                ? ENUM_TRANSACTION_STATUS.Confirmed
                : ENUM_TRANSACTION_STATUS.Failed,
              args: { questAddress: newQuestAddress },
            },
        );
        if (!txReceiptSaveQuest?.status || !newQuestAddress) {
          throw new Error('Failed to create quest');
        }
        if (values.bounty?.parsedAmount) {
          await fundQuestTransaction(
            modalId,
            values.bounty,
            newQuestAddress,
            `Sending funds to the Quest (3/3)`,
            walletAddress,
            setTransaction,
          );
        }

        if (mounted) setQuestDataState(emptyQuestData);
      } catch (e: any) {
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
      title="Create quest"
      openButton={
        buttonMode === 'link' ? (
          <ButtonLinkStyled theme={theme} onClick={onOpenButtonClick} title="Create quest">
            {buttonLabel}
          </ButtonLinkStyled>
        ) : (
          <Button
            icon={<IconPlus />}
            label={buttonLabel}
            wide
            mode={buttonMode === 'strong' ? 'strong' : 'normal'}
            display={buttonMode === 'icon' ? 'icon' : 'label'}
            onClick={onOpenButtonClick}
            title="Create quest"
          />
        )
      }
      isOpen={opened}
      onClose={closeModal}
    >
      <Formik
        initialValues={
          {
            ...questDataState,
            fallbackAddress: questDataState?.fallbackAddress,
          } as QuestModel
        }
        onSubmit={onQuestSubmit}
        validateOnChange
        validate={validate}
      >
        {({ values, handleChange, handleBlur, errors, touched, setTouched, handleSubmit }) => {
          const onNext = (currentStep: number) => {
            const stepErrors = validate(values);
            if (currentStep === 0) {
              setTouched({ title: true, description: true });
              return !(stepErrors.title || stepErrors.description);
            }
            if (currentStep === 1) {
              return !(errors.bounty || errors.fallbackAddress || errors.expireTime);
            }
            return true;
          };
          return (
            <FormStyled id="form-quest" onSubmit={handleSubmit} ref={formRef}>
              <Stepper
                submitButton={
                  <>
                    {questDeposit?.token?.token !== values.bounty?.token?.token && (
                      <WalletBallance
                        key="reward-token-balance"
                        askedTokenAmount={values.bounty}
                        setIsEnoughBalance={setIsEnoughBalance}
                      />
                    )}
                    {questDeposit && questDeposit?.parsedAmount > 0 && (
                      <>
                        <WalletBallance
                          key="collateral-token-balance"
                          askedTokenAmount={questDeposit}
                          setIsEnoughBalance={setIsEnoughBalance}
                        />
                        <AmountFieldInput
                          key="questDeposit"
                          id="questDeposit"
                          label="Quest Deposit"
                          tooltip="This amount will be hold by the Quest. It will be reclaimable from reclaim button once the Quest is expired."
                          value={questDeposit}
                          compact
                          showUsd
                        />
                      </>
                    )}
                    <Button
                      key="btn-save"
                      label="Create"
                      mode="positive"
                      type="submit"
                      form="form-quest"
                      className="m-8"
                      disabled={
                        !walletAddress || !isEnoughBalance || !isFormValid || !questDeposit?.token
                      }
                    />
                  </>
                }
                onNext={(currentStep) => onNext(currentStep)}
                steps={[
                  <>
                    <TextFieldInput
                      id="title"
                      label="Title"
                      isEdit
                      placeHolder="Quest title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fontSize="24px"
                      tooltip="Title should resume the Quest and be short and clear."
                      wide
                      error={touched.title && errors.title}
                    />
                    <TextFieldInput
                      id="description"
                      label="Description"
                      value={values.description}
                      isEdit
                      placeHolder="Quest description"
                      tooltip={
                        <>
                          <b>The quest description should include:</b>
                          <br />- Details about what the quest entails.
                          <br />- What evidence must be submitted by users claiming a reward for
                          completing the quest.
                          <br />- The payout amount. This could be a constant amount for quests that
                          payout multiple times, a range with reference to what determines what
                          amount, the contracts balance at time of claim.
                          <br />- The first {MAX_LINE_DESCRIPTION} lines only will be displayed in
                          main page. This is supposed to be an overview of the Quest. Try to stick
                          not use styled text to prevent any overflow cropping due to oversize.
                          <br />
                          ⚠️<i>The description should not include any sensitive information.</i>
                          <br />
                        </>
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description && errors.description}
                      wide
                      multiline
                      isMarkDown
                    />
                  </>,
                  <>
                    <AmountFieldInputFormik
                      id="bounty"
                      isEdit
                      tooltip="The initial funding of this quest. A token needs to be picked. You can enter the token address directly."
                      value={values?.bounty}
                      error={touched.bounty && errors.bounty}
                      tokenEditable
                      tokenLabel="Funding token"
                      amountLabel="Initial funding amount"
                      reversed
                      wide
                    />
                    <DateFieldInputFormik
                      id="expireTime"
                      label="Expire time"
                      tooltip="The expiry time for the quest completion. Past expiry time, funds will only be sendable to the fallback address."
                      isEdit
                      value={values.expireTime}
                      wide
                      onBlur={handleBlur}
                      error={touched.expireTime && (errors.expireTime as string)}
                      formik={formRef}
                    />
                    <AddressFieldInput
                      id="fallbackAddress"
                      label="Funds fallback address"
                      value={values.fallbackAddress ?? walletAddress}
                      tooltip="Unused funds at the specified expiry time can be returned to this address."
                      isEdit
                      onBlur={handleBlur}
                      error={touched.fallbackAddress && errors.fallbackAddress}
                      onChange={handleChange}
                      wide
                    />
                  </>,
                ]}
              />
            </FormStyled>
          );
        }}
      </Formik>
    </ModalBase>
  );
}
