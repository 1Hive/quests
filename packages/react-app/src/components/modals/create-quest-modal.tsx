/* eslint-disable no-nested-ternary */
import { Button, IconPlus, useTheme, Info } from '@1hive/1hive-ui';
import { debounce, noop, uniqueId } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MAX_LINE_DESCRIPTION } from 'src/constants';
import { QuestModel } from 'src/models/quest.model';
import styled from 'styled-components';
import * as QuestService from 'src/services/quest.service';
import { Form, Formik, FormikErrors } from 'formik';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { toChecksumAddress } from 'web3-utils';
import { useWallet } from 'src/contexts/wallet.context';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { IN_A_WEEK_IN_MS } from 'src/utils/date.utils';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { approveTokenTransaction, fundQuestTransaction } from 'src/services/transaction-handler';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { TransactionModel } from 'src/models/transaction.model';
import { FaEdit, FaEye } from 'react-icons/fa';
import { getNetwork } from 'src/networks';
import { flags } from 'src/services/feature-flag.service';
import { GUpx } from 'src/utils/style.util';
import { QuestStatus } from 'src/enums/quest-status.enum';
import { QuestViewMode } from 'src/enums/quest-view-mode.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import ModalBase, { ModalCallback } from './modal-base';
import Stepper from '../utils/stepper';
import { DateFieldInputFormik } from '../field-input/date-field-input';
import AmountFieldInput, { AmountFieldInputFormik } from '../field-input/amount-field-input';
import NumberFieldInput from '../field-input/number-field-input';
import { AddressFieldInput } from '../field-input/address-field-input';
import TextFieldInput from '../field-input/text-field-input';
import { WalletBalance } from '../wallet-balance';
import { feedDummyQuestData } from '../utils/debug-util';
import CheckboxFieldInput from '../field-input/checkbox-field-input';
import { FieldInput } from '../field-input/field-input';
import { Outset } from '../utils/spacer-util';

// #region StyledComponents

const ButtonLinkStyled = styled(Button)`
  border: none;
  box-shadow: none;
  padding: 0;
  height: fit-content;
  color: ${({ theme }: any) => theme.contentSecondary};
  font-weight: bold;
  background: transparent;
  padding-top: 4px;
  justify-content: flex-start;
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

const LineStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MaxPlayerLineStyled = styled.div`
  display: flex;
  align-items: center;
`;

const PlayerWrapperStyled = styled.div`
  padding-right: ${GUpx(2)};
`;

const DepositInfoStyled = styled(Info)`
  padding: ${GUpx(1)};
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
  status: QuestStatus.Draft,
} as QuestModel;

export default function QuestModal({
  questData = emptyQuestData,
  onClose = noop,
  questMode = QuestViewMode.ReadSummary,
  buttonMode = 'normal',
}: Props) {
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const [simulateSummary, setSimulateSummary] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('');
  const { walletAddress } = useWallet();
  const { questFactoryAddress } = getNetwork();
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const { setTransaction } = useTransactionContext();
  const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(true);
  const [isDepositEnoughBalance, setIsDepositEnoughBalance] = useState<boolean>(true);
  const [questDataState, setQuestDataState] = useState<QuestModel>(questData);
  const [questDeposit, setQuestDeposit] = useState<TokenAmountModel | null>();
  const isMountedRef = useIsMountedRef();
  const modalId = useMemo(() => uniqueId('quest-modal'), []);

  useEffect(() => {
    feedDummyQuestData(questData).then((data) => {
      if (isMountedRef.current) {
        setQuestDataState(data);
      }
    });

    QuestService.fetchCreateQuestDeposit(walletAddress).then((deposit) => {
      if (isMountedRef.current) {
        setQuestDeposit(deposit);
      }
    });
  }, []);

  useEffect(() => {
    switch (questMode) {
      case QuestViewMode.Create:
        setButtonLabel('Create quest');
        break;

      case QuestViewMode.Update:
        setButtonLabel('Update quest');
        break;

      default:
        break;
    }
  }, [questMode]);

  useEffect(() => {
    if (opened) {
      setShowPreview(false);
    }
  }, [opened]);

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
        errors.fallbackAddress = 'Fallback address is not valid';
      }
    }
    if ((!data.maxPlayers || data.maxPlayers <= 0) && !data.unlimited) {
      errors.maxPlayers = 'Max players needs to be set or check as unlimited';
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
    if (isFormValid) {
      if (!questDeposit?.token) throw new Error('Quest deposit token is not set');

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
        let txPayload = {
          modalId,
          message: `Creating Quest (2/${values.bounty?.parsedAmount ? '3' : '2'})`,
          status: TransactionStatus.WaitingForSignature,
          type: 'QuestCreate',
        } as TransactionModel;
        setTransaction(txPayload);
        const txReceiptSaveQuest = await QuestService.saveQuest(
          walletAddress,
          values.fallbackAddress ?? walletAddress,
          {
            ...values,
            expireTime: values.expireTime,
            creatorAddress: walletAddress,
            rewardToken: values.bounty!.token,
            maxPlayers: values.unlimited ? 0 : values.maxPlayers,
          },
          undefined,
          (txHash) => {
            txPayload = { ...txPayload, hash: txHash };
            setTransaction({
              ...txPayload,
              status: TransactionStatus.Pending,
            });
          },
        );

        newQuestAddress = txReceiptSaveQuest?.events?.flatMap((x) => x.args).filter((x) => !!x)[0];
        if (!newQuestAddress) throw Error('Something went wrong, Quest was not created');

        setTransaction({
          ...txPayload,
          status: txReceiptSaveQuest?.status
            ? TransactionStatus.Confirmed
            : TransactionStatus.Failed,
          args: { questAddress: newQuestAddress },
        });
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

        if (isMountedRef.current) {
          setQuestDataState(emptyQuestData);
        }
      } catch (e: any) {
        setTransaction(
          (oldTx) =>
            oldTx && {
              ...oldTx,
              status: TransactionStatus.Failed,
              message: computeTransactionErrorMessage(e),
            },
        );
      }
    }
  };

  return (
    <>
      {flags.CREATE_QUEST && (
        <ModalBase
          id={modalId}
          title="Create quest"
          openButton={
            buttonMode === 'link' ? (
              <ButtonLinkStyled
                theme={theme}
                onClick={onOpenButtonClick}
                title="Create quest"
                label={buttonLabel}
                className="open-create-quest-btn"
              />
            ) : (
              <Button
                className="open-create-quest-btn"
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
                unlimited: true,
                fallbackAddress: questDataState?.fallbackAddress,
              } as QuestModel
            }
            onSubmit={onQuestSubmit}
            validateOnBlur
            // validateOnChange
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
                          <WalletBalance
                            key="reward-token-balance"
                            askedTokenAmount={values.bounty}
                            setIsEnoughBalance={setIsEnoughBalance}
                            label="Reward balance"
                            tooltip="The balance of the reward token in the connected wallet"
                          />
                        )}
                        {questDeposit && questDeposit?.parsedAmount > 0 && (
                          <>
                            <WalletBalance
                              key="deposit-token-balance"
                              askedTokenAmount={questDeposit}
                              setIsEnoughBalance={setIsDepositEnoughBalance}
                              label="Deposit balance"
                              tooltip="The balance of the deposit token in the connected wallet"
                            />
                            <DepositInfoStyled
                              mode={isDepositEnoughBalance ? 'info' : 'warning'}
                              key="questDeposit"
                            >
                              <AmountFieldInput
                                id="questDeposit"
                                label="Create Deposit"
                                tooltip="This amount will be hold by the Quest. It will be reclaimable from reclaim button once the Quest is expired."
                                value={questDeposit}
                                compact
                                showUsd
                              />
                            </DepositInfoStyled>
                          </>
                        )}
                        <Button
                          key="btn-save"
                          label="Create"
                          mode="positive"
                          type="submit"
                          form="form-quest"
                          className="m-8 complete-create-quest-btn"
                          title={
                            !questDeposit?.token
                              ? 'Not ready ...'
                              : !isFormValid
                              ? 'Form not valid'
                              : 'Create quest'
                          }
                          disabled={
                            !questDeposit?.token ||
                            !isEnoughBalance ||
                            !isDepositEnoughBalance ||
                            !isFormValid
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
                          label={
                            <>
                              <LineStyled>
                                Description
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
                                        : 'Show a preview of the description'
                                    }
                                  />
                                </Outset>
                                {showPreview && (
                                  <Button
                                    size="mini"
                                    label={simulateSummary ? 'Detail' : 'Summary'}
                                    onClick={() => setSimulateSummary((old) => !old)}
                                    title={
                                      !showPreview
                                        ? 'Enable preview first'
                                        : `Simulate ${
                                            simulateSummary ? 'detail' : 'summary'
                                          } description view`
                                    }
                                  />
                                )}
                              </LineStyled>
                            </>
                          }
                          value={values.description}
                          isEdit={!showPreview}
                          placeHolder="Quest description"
                          blockVisibility={simulateSummary ? 'hidden' : 'visible'}
                          tooltip={
                            <>
                              <b>The quest description should include:</b>
                              <br />- Details about what the quest entails.
                              <br />- What evidence must be submitted by users claiming a reward for
                              completing the quest.
                              <br />- The payout amount. This could be a constant amount for quests
                              that payout multiple times, a range with reference to what determines
                              what amount, the contracts balance at time of claim.
                              <br />- The first {MAX_LINE_DESCRIPTION} lines only will be displayed
                              in main page. This is supposed to be an overview of the Quest. Try not
                              to use styled text to prevent any overflow cutting due to oversize.
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
                          maxLine={simulateSummary ? MAX_LINE_DESCRIPTION : undefined}
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
                        <TextFieldInput
                          id="communicationLink"
                          label="Communication link"
                          value={values.communicationLink}
                          tooltip="The link to the discussion platform. It could be a forum, a discord username or any desired communication platform"
                          isEdit
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeHolder="Quest communication link"
                          wide
                        />
                        <FieldInput error={touched.maxPlayers && errors.maxPlayers}>
                          <MaxPlayerLineStyled>
                            <PlayerWrapperStyled>
                              <NumberFieldInput
                                id="maxPlayers"
                                label="Max players"
                                isEdit
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.maxPlayers}
                                tooltip="The max amount of players that can simultaneously work on this quest"
                                disabled={values.unlimited}
                              />
                            </PlayerWrapperStyled>
                            <CheckboxFieldInput
                              id="unlimited"
                              label="Unlimited"
                              onChange={handleChange}
                              handleBlur={handleBlur}
                              value={values.unlimited}
                              isEdit
                              tooltip="Select for unlimited amount of players"
                            />
                          </MaxPlayerLineStyled>
                        </FieldInput>
                      </>,
                    ]}
                  />
                </FormStyled>
              );
            }}
          </Formik>
        </ModalBase>
      )}
    </>
  );
}
