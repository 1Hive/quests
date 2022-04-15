import { Card, useViewport } from '@1hive/1hive-ui';
import { Form, Formik, FormikErrors, FormikTouched } from 'formik';
import { noop } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { debounce, uniqueId } from 'lodash';

import {
  ENUM,
  ENUM_PAGES,
  ENUM_QUEST_VIEW_MODE,
  ENUM_QUEST_STATE,
  ENUM_TRANSACTION_STATUS,
} from 'src/constants';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import * as QuestService from 'src/services/quest.service';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/style.util';
import { TokenModel } from 'src/models/token.model';
import { useWallet } from 'src/contexts/wallet.context';
import { toChecksumAddress } from 'web3-utils';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { FormErrors } from 'src/models/form-errors';
import ScheduleClaimModal from './modals/schedule-claim-modal';
import FundModal from './modals/fund-modal';
import ReclaimFundsModal from './modals/reclaim-funds-modal';
import DateFieldInput, { DateFieldInputFormik } from './field-input/date-field-input';
import AmountFieldInput, { AmountFieldInputFormik } from './field-input/amount-field-input';
import TextFieldInput from './field-input/text-field-input';
import ClaimList from './claim-list';
import { processQuestState } from '../services/state-machine';
import { StateTag } from './state-tag';
import { AddressFieldInput } from './field-input/address-field-input';
import { BREAKPOINTS } from '../styles/breakpoints';

// #region StyledComponents

const TitleLinkStyled = styled(Link)`
  font-weight: 100;
`;

const LinkStyled = styled(Link)`
  font-weight: 100;
`;

const CardStyled = styled(Card)`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  min-height: 250px;

  ${({ isEdit }: any) => isEdit && 'border:none;'}

  & > div:first-child {
    padding-bottom: 0;
  }
`;

const QuestFooterStyled = styled.div`
  width: 100%;
  text-align: right;
  padding: ${GUpx(2)};
  padding-top: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
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

const TwoColumnStyled = styled.div<{ twoCol?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  ${(props) => (props.twoCol ? '' : 'flex-wrap: wrap;')}
`;

const FirstColStyled = styled.div`
  margin: 0 ${GUpx()};
  max-width: 90%;
  flex-grow: 1;
  overflow-wrap: break-word;
`;

const SecondColStyled = styled.div`
  margin: 0 ${GUpx()};
  max-width: 90%;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
`;

const QuestHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
  padding: ${GUpx(3)};
  padding-bottom: ${GUpx()};
  width: 100%;
`;

// #endregion

type Props = {
  dataState: { questData?: QuestModel; setQuestData?: (_questData: QuestModel) => void };
  questMode?: string;
  isLoading?: boolean;
  onSave?: (_questAddress: string) => void;
  css?: any;
};

export default function Quest({
  dataState,
  isLoading = false,
  questMode = ENUM_QUEST_VIEW_MODE.ReadDetail,
  onSave = noop,
  css,
}: Props) {
  const { width: vw } = useViewport();
  const { walletAddress } = useWallet();
  const { defaultToken } = getNetwork();
  const formRef = useRef<HTMLFormElement>(null);
  const { questData, setQuestData } = dataState;
  const [loading, setLoading] = useState(isLoading);
  const [isEdit, setIsEdit] = useState(false);
  const [bounty, setBounty] = useState<TokenAmountModel | null>();
  const [claimUpdated, setClaimUpdate] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const { setTransaction } = useTransactionContext();
  const [claimDeposit, setClaimDeposit] = useState<TokenAmountModel | null>();
  const [challengeDeposit, setChallengeDeposit] = useState<TokenAmountModel | null>();
  const [twoCol, setTwoCol] = useState(true);

  let isSubscribed = true;

  useEffect(() => {
    setTwoCol(vw >= BREAKPOINTS.large);
  }, [vw]);

  useEffect(() => {
    if (!questData) return;

    setIsEdit(
      questMode === ENUM_QUEST_VIEW_MODE.Create || questMode === ENUM_QUEST_VIEW_MODE.Update,
    );

    const getClaimDeposit = async () => {
      // Don't show deposit of expired
      if (questMode === ENUM_QUEST_VIEW_MODE.ReadDetail) {
        if (
          questData.state === ENUM_QUEST_STATE.Archived ||
          questData.state === ENUM_QUEST_STATE.Expired
        ) {
          setClaimDeposit(null);
        } else {
          try {
            const { challenge, claim } = await QuestService.fetchDeposits();
            setClaimDeposit(claim);
            setChallengeDeposit(challenge);
          } catch (error) {
            Logger.exception(error);
          }
        }
      }
    };

    if (!questData.rewardToken) {
      setBounty(null);
    } else if (questData.address) {
      fetchBalanceOfQuest(questData.address, questData.rewardToken);
    }

    if (questMode === ENUM_QUEST_VIEW_MODE.ReadDetail) {
      getClaimDeposit();
    }

    // eslint-disable-next-line consistent-return
    return () => {
      isSubscribed = false;
    };
  }, [questMode, questData, walletAddress]);

  const onQuestSubmit = async (values: QuestModel, setSubmitting: Function) => {
    validate(values); // Validate one last time before submitting
    if (isFormValid) {
      setLoading(true);
      let createdQuestAddress: string;
      try {
        setTransaction({
          id: uniqueId(),
          estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestCreating,
          message: 'Creating Quest...',
          status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
        });
        const txReceiptSaveQuest = await QuestService.saveQuest(
          walletAddress,
          values.fallbackAddress ?? walletAddress,
          {
            ...values,
            expireTime: values.expireTime,
            creatorAddress: walletAddress,
            rewardToken: values.bounty!.token ?? defaultToken,
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
        setTransaction(
          (oldTx) =>
            oldTx && {
              ...oldTx,
              status: txReceiptSaveQuest?.status
                ? ENUM_TRANSACTION_STATUS.Confirmed
                : ENUM_TRANSACTION_STATUS.Failed,
            },
        );

        if (txReceiptSaveQuest?.status) {
          if (values.bounty?.parsedAmount) {
            createdQuestAddress = (txReceiptSaveQuest?.events?.[0] as any)?.args?.[0];
            if (!createdQuestAddress) throw Error('Something went wrong, Quest was not created');
            setTransaction({
              id: uniqueId(),
              estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestFunding,
              message: 'Sending funds to Quest',
              status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
            });
            const txReceiptFundQuest = await QuestService.fundQuest(
              walletAddress,
              createdQuestAddress,
              values.bounty!,
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
                  status: txReceiptSaveQuest?.status
                    ? ENUM_TRANSACTION_STATUS.Confirmed
                    : ENUM_TRANSACTION_STATUS.Failed,
                },
            );
            if (!txReceiptFundQuest?.status || !createdQuestAddress) {
              throw new Error('Failed to create quest');
            } else {
              onSave(createdQuestAddress);
            }
            fetchBalanceOfQuest(createdQuestAddress, values.bounty.token);
          }
        }
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
    }
  };
  const fetchBalanceOfQuest = (address: string, token: TokenModel | string) => {
    if (!questData) return;
    QuestService.getBalanceOf(token, address)
      .then((result) => {
        if (isSubscribed) {
          questData.bounty = result ?? undefined;
          processQuestState(questData);
          setBounty(result);
        }
      })
      .catch((err) => {
        Logger.exception(err);
        setBounty(undefined);
      });
  };

  const onScheduleModalClosed = (success: boolean) => {
    if (success) {
      setClaimUpdate(claimUpdated + 1); // Trigger a claim update in claim list
    }
  };

  const onFundModalClosed = (success: boolean) => {
    if (!questData) return;
    setTimeout(() => {
      if (success && questData.address && questData.rewardToken && walletAddress) {
        fetchBalanceOfQuest(questData.address, questData.rewardToken);
        setClaimUpdate(claimUpdated + 1);
      }
    }, 500);
  };

  const refresh = (data?: QuestModel) => {
    if (data) {
      setQuestData?.(data);
    }
  };
  const debounceSave = useCallback(
    debounce((data?: QuestModel) => refresh(data), 500),
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

  const questContent = (
    values: QuestModel,
    handleChange = noop,
    errors: FormErrors<QuestModel>,
    touched: FormikTouched<QuestModel>,
    handleBlur = noop,
  ) => {
    const titleInput = (
      <TextFieldInput
        id="title"
        label={isEdit ? 'Title' : undefined}
        isEdit={isEdit}
        isLoading={loading || !questData}
        placeHolder="Quest title"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        fontSize="24px"
        tooltip="Title should resume the Quest and be short and clear."
        wide
        error={touched.title && errors.title}
      />
    );

    return (
      <>
        {!isEdit && (
          <QuestHeaderStyled>
            {questMode === ENUM_QUEST_VIEW_MODE.ReadSummary ? (
              <TitleLinkStyled to={`/${ENUM_PAGES.Detail}?id=${values.address}`}>
                {titleInput}
              </TitleLinkStyled>
            ) : (
              titleInput
            )}
            <AddressFieldInput
              id="address"
              value={values.address}
              isLoading={loading || !questData}
            />
          </QuestHeaderStyled>
        )}
        <TwoColumnStyled twoCol={twoCol}>
          <>
            <FirstColStyled className="pb-0">
              {isEdit && titleInput}
              <TextFieldInput
                id="description"
                label={isEdit ? 'Description' : undefined}
                value={values.description}
                isEdit={isEdit}
                isLoading={loading || !questData}
                placeHolder="Quest description"
                tooltip={
                  <>
                    <b>The quest description should include:</b>
                    <br />- Details about what the quest entails. <br />- What evidence must be
                    submitted by users claiming a reward for completing the quest. <br />- The
                    payout amount. This could be a constant amount for quests that payout multiple
                    times, a range with reference to what determines what amount, the contracts
                    balance at time of claim. <br />
                    ⚠️<i>The description should not include any sensitive information.</i>
                  </>
                }
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && errors.description}
                wide
                multiline
                isMarkDown
                maxLine={questMode === ENUM_QUEST_VIEW_MODE.ReadSummary ? 5 : undefined}
                ellipsis={
                  <LinkStyled to={`/${ENUM_PAGES.Detail}?id=${questData?.address}`}>
                    Read more
                  </LinkStyled>
                }
              />
            </FirstColStyled>
            <SecondColStyled>
              {(bounty !== null || isEdit) && (
                <AmountFieldInputFormik
                  id="bounty"
                  label={questMode === ENUM_QUEST_VIEW_MODE.Create ? undefined : 'Available bounty'}
                  isEdit={isEdit}
                  tooltip={
                    isEdit
                      ? 'The initial funding of this quest. A token needs to be picked. You can enter the token address directly.'
                      : "The available amount of this quest's funding pool."
                  }
                  value={questData?.bounty}
                  isLoading={loading || (!isEdit && !bounty) || !questData}
                  error={touched.bounty && errors.bounty}
                  tokenEditable
                  tokenLabel={isEdit ? 'Funding token' : undefined}
                  amountLabel={isEdit ? 'Initial funding amount' : undefined}
                  reversed={isEdit}
                  wide
                />
              )}
              {questMode === ENUM_QUEST_VIEW_MODE.ReadDetail && (
                <>
                  {claimDeposit !== null && (
                    <AmountFieldInput
                      id="claimDeposit"
                      label="Claim deposit"
                      tooltip="This amount will be staked when claiming a bounty. If the claim is challenged and ruled in favor of the challenger, you will lose this deposit."
                      value={claimDeposit}
                      isLoading={loading || (!isEdit && !claimDeposit) || !questData}
                      wide
                    />
                  )}
                  <DateFieldInput
                    id="creationTime"
                    label="Creation time"
                    isLoading={loading || !questData}
                    value={values.creationTime}
                    wide
                  />
                </>
              )}
              <DateFieldInputFormik
                id="expireTime"
                label="Expire time"
                tooltip="The expiry time for the quest completion. Past expiry time, funds will only be sendable to the fallback address."
                isEdit={isEdit}
                isLoading={loading || !questData}
                value={values.expireTime}
                wide
                onBlur={handleBlur}
                error={touched.expireTime && errors.expireTime}
                formik={formRef}
              />
              {isEdit && (
                <AddressFieldInput
                  id="fallbackAddress"
                  label="Funds fallback address"
                  value={values.fallbackAddress ?? walletAddress}
                  isLoading={loading || !questData}
                  tooltip="Unused funds at the specified expiry time can be returned to this address."
                  isEdit
                  onBlur={handleBlur}
                  error={touched.fallbackAddress && errors.fallbackAddress}
                  onChange={handleChange}
                  wide
                />
              )}
            </SecondColStyled>
          </>
        </TwoColumnStyled>
        {!loading && !isEdit && questData?.address && (
          <>
            {questMode === ENUM_QUEST_VIEW_MODE.ReadDetail && challengeDeposit && (
              <ClaimList
                newClaim={claimUpdated}
                questData={questData}
                questTotalBounty={bounty}
                challengeDeposit={challengeDeposit}
              />
            )}
            {questMode !== ENUM_QUEST_VIEW_MODE.ReadSummary &&
              questData.address &&
              walletAddress &&
              bounty && (
                <QuestFooterStyled>
                  {values.state === ENUM_QUEST_STATE.Active ? (
                    <>
                      <FundModal quest={questData} onClose={onFundModalClosed} />
                      {claimDeposit && (
                        <ScheduleClaimModal
                          questAddress={questData.address}
                          questTotalBounty={bounty}
                          claimDeposit={claimDeposit}
                          onClose={onScheduleModalClosed}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {!!bounty?.parsedAmount && (
                        <ReclaimFundsModal bounty={bounty} questData={values} />
                      )}
                    </>
                  )}
                </QuestFooterStyled>
              )}
          </>
        )}
      </>
    );
  };

  return (
    <CardStyled
      style={css}
      isSummary={questMode === ENUM_QUEST_VIEW_MODE.ReadSummary}
      id={questData?.address}
      isEdit={isEdit}
    >
      {!loading && questData && <StateTag state={questData.state} />}
      <Formik
        initialValues={
          {
            ...questData,
            fallbackAddress: questData?.fallbackAddress ?? walletAddress,
          } as QuestModel
        }
        onSubmit={(values, { setSubmitting }) => onQuestSubmit(values, setSubmitting)}
        validate={validate}
        validateOnBlur
        validateOnChange={false}
      >
        {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) =>
          isEdit && questData ? (
            <FormStyled
              onSubmit={handleSubmit}
              ref={formRef}
              id={`form-quest-form-${questData.address ?? 'new'}`}
            >
              {questContent(
                values,
                handleChange,
                errors as FormErrors<QuestModel>,
                touched,
                handleBlur,
              )}
            </FormStyled>
          ) : (
            questContent(values, handleChange, errors as FormErrors<QuestModel>, touched)
          )
        }
      </Formik>
    </CardStyled>
  );
}
