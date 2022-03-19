import { Card, useToast, useViewport } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
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
import { GUpx } from 'src/utils/css.util';
import { TokenModel } from 'src/models/token.model';
import { useWallet } from 'src/contexts/wallet.context';
import { toChecksumAddress } from 'web3-utils';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
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
  color: dodgerblue;
  text-decoration: none;
`;

const AddressWrapperStyled = styled.div`
  width: 390px;
`;

const CardStyled = styled(Card)`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  min-height: 250px;
  border: none;

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

const TwoColumnStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  ${(props: any) => (props.twoCol ? '' : 'flex-wrap: wrap;')}
`;

const FirstColStyled = styled.div`
  margin: 0 ${GUpx(3)};
  flex-grow: 1;
  max-width: 80%;
  overflow-wrap: break-word;
`;

const SecondColStyled = styled.div`
  margin: 0 ${GUpx(3)};
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
  dataState: { questData: QuestModel; setQuestData?: (_questData: QuestModel) => void };
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
  const { setTransaction } = useTransactionContext();
  const [claimDeposit, setClaimDeposit] = useState<TokenAmountModel | null>();
  const [challengeDeposit, setChallengeDeposit] = useState<TokenAmountModel | null>();
  const toast = useToast();
  const [twoCol, setTwoCol] = useState(true);
  useEffect(() => {
    setTwoCol(vw >= BREAKPOINTS.large);
  }, [vw]);

  useEffect(() => {
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

    if (!questData.rewardToken) setBounty(null);
    else if (questData.address) fetchBalanceOfQuest(questData.address, questData.rewardToken);

    if (questMode === ENUM_QUEST_VIEW_MODE.ReadDetail) {
      getClaimDeposit();
    }
  }, [questMode, questData.rewardToken, walletAddress]);

  const onQuestSubmit = async (values: QuestModel, setSubmitting: Function) => {
    const errors = [];
    if (!values.description) errors.push('Validation : Description is required');
    if (!values.title) errors.push('Validation : Title is required');
    if (values.fallbackAddress) {
      try {
        values.fallbackAddress = toChecksumAddress(values.fallbackAddress);
      } catch (error) {
        errors.push('Validation : Player address is not valid');
      }
    }
    if (values.expireTime.getTime() < Date.now())
      errors.push('Validation : Expiration have to be later than now');
    if (!values.bounty?.token) errors.push('Validation : Bounty token is required');
    else if (values.bounty.parsedAmount < 0) errors.push('Validation : Invalid initial bounty');

    if (errors.length) {
      errors.forEach(toast);
    } else {
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
            if (!txReceiptFundQuest?.status || !createdQuestAddress)
              throw new Error('Failed to create quest');
            else onSave(createdQuestAddress);
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
    QuestService.getBalanceOf(token, address)
      .then((result) => {
        questData.bounty = result ?? undefined;
        processQuestState(questData);
        setBounty(result);
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
    debounceSave(data);
  };

  const questContent = (values: QuestModel, handleChange = noop) => {
    const titleInput = (
      <TextFieldInput
        id="title"
        label={isEdit ? 'Title' : undefined}
        isEdit={isEdit}
        isLoading={loading}
        placeHolder="Quest title"
        value={values.title}
        onChange={handleChange}
        fontSize="24px"
        tooltip="Title of your quest"
        tooltipDetail="Title should resume the quest"
        wide
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
            <AddressFieldInput id="address" value={values.address} isLoading={loading} />
          </QuestHeaderStyled>
        )}
        <TwoColumnStyled isEdit={isEdit} twoCol={twoCol}>
          <>
            <FirstColStyled gu16 className="pb-0">
              {isEdit && titleInput}
              <TextFieldInput
                id="description"
                label={isEdit ? 'Description' : undefined}
                value={values.description}
                isEdit={isEdit}
                isLoading={loading}
                placeHolder="Quest description"
                tooltip="Quest Description"
                tooltipDetail={
                  <>
                    <b>The quest description should include:</b>
                    <ul>
                      <li>Details about what the quest entails.</li>
                      <li>
                        What evidence must be submitted by users claiming a reward for completing
                        the quest.
                      </li>
                      <li>
                        The payout amount. This could be a constant amount for quests that payout
                        multiple times, a range with reference to what determines what amount, the
                        contracts balance at time of claim.
                      </li>
                    </ul>
                  </>
                }
                onChange={handleChange}
                wide
                multiline
                isMarkDown
                maxLine={questMode === ENUM_QUEST_VIEW_MODE.ReadSummary ? 10 : undefined}
                ellipsis={
                  <LinkStyled to={`/${ENUM_PAGES.Detail}?id=${questData.address}`}>
                    Read more
                  </LinkStyled>
                }
              />
            </FirstColStyled>
            <SecondColStyled wide={isEdit}>
              {(bounty !== null || isEdit) && (
                <AmountFieldInputFormik
                  id="bounty"
                  label={questMode === ENUM_QUEST_VIEW_MODE.Create ? undefined : 'Available bounty'}
                  isEdit={isEdit}
                  tooltip="Bounty"
                  tooltipDetail={
                    isEdit
                      ? 'The initial funding of this quest. A token needs to be picked. You can enter the token address directly.'
                      : "The available amount of this quest's funding pool."
                  }
                  value={questData.bounty}
                  isLoading={loading || (!isEdit && !bounty)}
                  formik={formRef}
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
                      tooltip="Claim deposit"
                      tooltipDetail="This amount will be staked when claiming a bounty. If the claim is successfully challenged, you will lose this deposit."
                      value={claimDeposit}
                      isLoading={loading || (!isEdit && !claimDeposit)}
                      wide
                    />
                  )}
                  <DateFieldInput
                    id="creationTime"
                    label="Creation time"
                    isLoading={loading}
                    value={values.creationTime}
                    wide
                  />
                </>
              )}
              <DateFieldInputFormik
                id="expireTime"
                label="Expire time"
                tooltip="Expire time"
                tooltipDetail="The expiry time for the quest completion. Funds will return to the fallback address when the expiry time is reached."
                isEdit={isEdit}
                isLoading={loading}
                value={values.expireTime}
                wide
                formik={formRef}
              />
              {isEdit && (
                <AddressWrapperStyled>
                  <AddressFieldInput
                    id="fallbackAddress"
                    label="Funds fallback address"
                    value={values.fallbackAddress ?? walletAddress}
                    isLoading={loading}
                    tooltip="Fallback Address"
                    tooltipDetail="Unused funds at the specified expiry time can be returned to this address"
                    isEdit
                    onChange={handleChange}
                    wide
                  />
                </AddressWrapperStyled>
              )}
            </SecondColStyled>
          </>
        </TwoColumnStyled>
        {!loading && !isEdit && questData.address && (
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
      id={questData.address}
    >
      {!loading && <StateTag state={questData.state} />}
      <Formik
        initialValues={
          {
            ...questData,
            fallbackAddress: questData.fallbackAddress ?? walletAddress,
          } as QuestModel
        }
        onSubmit={(values, { setSubmitting }) => onQuestSubmit(values, setSubmitting)}
        validate={validate}
      >
        {({ values, handleChange, handleSubmit }) =>
          isEdit ? (
            <FormStyled
              onSubmit={handleSubmit}
              ref={formRef}
              id={`form-quest-form-${questData.address ?? 'new'}`}
            >
              {questContent(values, handleChange)}
            </FormStyled>
          ) : (
            questContent(values, handleChange)
          )
        }
      </Formik>
    </CardStyled>
  );
}
