import { AddressField, Card, Split, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import {
  ENUM,
  ENUM_PAGES,
  ENUM_QUEST_VIEW_MODE,
  ENUM_QUEST_STATE,
  ENUM_TRANSACTION_STATUS,
} from 'src/constants';
import { useERC20Contract, useFactoryContract } from 'src/hooks/use-contract.hook';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import * as QuestService from 'src/services/quest.service';
import { IN_A_WEEK_IN_MS, ONE_HOUR_IN_MS } from 'src/utils/date.utils';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { ClaimModel } from 'src/models/claim.model';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/css.util';
import ScheduleClaimModal from './modals/schedule-claim-modal';
import FundModal from './modals/fund-modal';
import ReclaimFundsModal from './modals/reclaim-funds-modal';
import DateFieldInput from './field-input/date-field-input';
import { Outset } from './utils/spacer-util';
import AmountFieldInput, { AmountFieldInputFormik } from './field-input/amount-field-input';
import TextFieldInput from './field-input/text-field-input';
import ClaimList from './claim-list';
import { processQuestState } from '../services/state-machine';
import { StateTag } from './state-tag';
import ExecuteClaimModal from './modals/execute-claim-modal';
import { AddressFieldInput } from './field-input/address-field-input';
// #region StyledComponents

const LinkStyled = styled(Link)`
  text-decoration: underline;
  color: white;
`;
const CardStyled = styled(Card)`
  justify-content: flex-start;
  width: 100%;
  height: fit-content;
  border: none;
`;

const QuestFooterStyled = styled.div`
  width: 100%;
  text-align: right;
  padding: ${GUpx(2)};
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

const NoPaddingSplitStyled = styled(Split)`
  padding-bottom: 0 !important;
`;
const TitleStyled = styled.h1`
  font-size: x-large;
  margin-bottom: 8px;
`;
const FallbackWrapperStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// #endregion

type Props = {
  data?: QuestModel;
  questMode?: string;
  isLoading?: boolean;
  onSave?: Function;
  css?: any;
};

export default function Quest({
  data = {
    expireTimeMs: IN_A_WEEK_IN_MS + 24 * 36000,
    state: ENUM_QUEST_STATE.Draft,
  },
  isLoading = false,
  questMode = ENUM_QUEST_VIEW_MODE.ReadDetail,
  onSave = noop,
  css,
}: Props) {
  const wallet = useWallet();
  const { defaultToken } = getNetwork();
  const erc20Contract = useERC20Contract(data.rewardToken ?? defaultToken);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(isLoading);
  const [isEdit, setIsEdit] = useState(false);
  const [bounty, setBounty] = useState<TokenAmountModel | null>();
  const [claims, setClaims] = useState<ClaimModel[]>();
  const { pushTransaction, updateTransactionStatus } = useTransactionContext()!;
  (window as any).pushTransaction = pushTransaction;
  (window as any).updateTransactionStatus = updateTransactionStatus;
  const [claimDeposit, setClaimDeposit] = useState<TokenAmountModel | null>();
  const [challengeDeposit, setChallengeDeposit] = useState<TokenAmountModel | null>();
  const toast = useToast();
  const questFactoryContract = useFactoryContract();
  const [currentPlayerClaim, setCurrentPlayerClaim] = useState<ClaimModel | undefined>();

  useEffect(() => {
    setIsEdit(
      questMode === ENUM_QUEST_VIEW_MODE.Create || questMode === ENUM_QUEST_VIEW_MODE.Update,
    );

    const getClaimDeposit = async () => {
      // Don't show deposit of expired
      if (data.state === ENUM_QUEST_STATE.Archived || data.state === ENUM_QUEST_STATE.Expired)
        setClaimDeposit(null);
      else
        try {
          const { challenge, claim } = await QuestService.fetchDeposits();
          setClaimDeposit(claim);
          setChallengeDeposit(challenge);
        } catch (error) {
          Logger.error(error);
        }
    };
    const fetchClaims = async () => {
      const result = await QuestService.fetchQuestClaims(data);
      setClaims(result);
    };
    const getBalanceOfQuest = async (address: string) => {
      try {
        const result = await QuestService.getBalanceOf(erc20Contract, defaultToken, address);
        data.bounty = result ?? undefined;
        processQuestState(data);
        setBounty(result);
      } catch (error) {
        Logger.error(error);
        setBounty(null);
      }
    };

    if (data.address) getBalanceOfQuest(data.address);

    if (questMode === ENUM_QUEST_VIEW_MODE.ReadDetail) {
      fetchClaims();
      getClaimDeposit();
    }
  }, [questMode]);

  useEffect(() => {
    if (wallet.account) {
      if (claims) setCurrentPlayerClaim(claims.find((x) => x.playerAddress === wallet.account));
      // values.fallbackAddress = wallet.account;
    }
  }, [claims, wallet.account]);

  const onQuestSubmit = async (values: QuestModel, setSubmitting: Function) => {
    const errors = [];
    if (!values.description) errors.push('Description is required');
    if (!values.title) errors.push('Title is required');
    if (!values.fallbackAddress) errors.push('Funds fallback address is required');
    if (values.expireTimeMs < Date.now()) errors.push('Expiration have to be later than now');
    if (!questFactoryContract) {
      Logger.error(
        `Error : failed to instanciate contract <questFactoryContract>, enable verbose to see error`,
      );
      return;
    }

    if (errors.length) {
      errors.forEach(toast);
    } else {
      setLoading(true);
      let createdQuestAddress;
      try {
        if (!questFactoryContract) {
          throw new Error(
            `Failed to instanciate contract <questFactoryContract>, enable verbose to see error`,
          );
        }
        // Set noon to prevent rounding form changing date
        const timeValue = new Date(values.expireTimeMs ?? 0).getTime() + 12 * ONE_HOUR_IN_MS;
        const pendingMessage = 'Creating Quest...';
        toast(pendingMessage);
        const txReceiptSaveQuest = await QuestService.saveQuest(
          questFactoryContract,
          values.fallbackAddress!,
          { ...values, expireTimeMs: timeValue, creatorAddress: wallet.account },
          undefined,
          (tx) => {
            pushTransaction({
              hash: tx,
              estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestCreating,
              pendingMessage,
              status: ENUM_TRANSACTION_STATUS.Pending,
            });
          },
        );
        updateTransactionStatus({
          hash: txReceiptSaveQuest.transactionHash,
          status: ENUM_TRANSACTION_STATUS.Confirmed,
        });
        onSave();
        if (txReceiptSaveQuest.status) {
          if (!values.bounty?.parsedAmount) toast('Operation succeed');
          else {
            createdQuestAddress = (txReceiptSaveQuest?.events?.[0] as any)?.args?.[0];
            if (!createdQuestAddress) throw Error('Something went wrong, Quest was not created');
            toast('Sending funds to Quest...');
            const txReceiptFundQuest = await QuestService.fundQuest(
              erc20Contract!,
              createdQuestAddress,
              values.bounty,
              (tx) => {
                pushTransaction({
                  hash: tx,
                  estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestFunding,
                  pendingMessage: 'Quest funding...',
                  status: ENUM_TRANSACTION_STATUS.Pending,
                });
              },
            );
            updateTransactionStatus({
              hash: txReceiptFundQuest.transactionHash,
              status: ENUM_TRANSACTION_STATUS.Confirmed,
            });
            if (txReceiptFundQuest) toast('Operation succeed');
          }
        }
      } catch (e: any) {
        Logger.error(e);
        toast(
          !e?.message || e.message.includes('\n') || e.message.length > 75
            ? 'Oops. Something went wrong'
            : e.message,
        );
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    }
  };

  const questContent = (values: QuestModel, handleChange = noop) => (
    <>
      <NoPaddingSplitStyled
        primary={
          <Outset gu16 className="pb-0">
            {isEdit && <TitleStyled>Create Quest</TitleStyled>}
            <Outset gu8 vertical className="block">
              <NoPaddingSplitStyled
                primary={
                  // <LinkStyled to={`/${ENUM_PAGES.Detail}?id=${values.address}`}>
                  //   <Button icon={<IconPlus />} label="Details" wide mode="strong" />
                  // </LinkStyled>
                  <LinkStyled to={`/${ENUM_PAGES.Detail}?id=${values.address}`}>
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
                      wide
                    />
                  </LinkStyled>
                }
                secondary={
                  !isEdit &&
                  values.address &&
                  (loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      <AddressField id="address" address={values.address} autofocus={false} />
                    </>
                  ))
                }
              />
            </Outset>
            <Outset gu8 vertical>
              <TextFieldInput
                id="description"
                label={isEdit ? 'Description' : undefined}
                value={values.description}
                isEdit={isEdit}
                isLoading={loading}
                placeHolder="Quest description"
                tooltip="Quest Description"
                tooltipDetail={
                  <div>
                    The quest description should include: <br />
                    -Details about what the quest entails.
                    <br />
                    -What evidence must be submitted by users claiming a reward for completing the
                    quest.
                    <br />
                    -The payout amount. This could be a constant amount for quests that payout
                    multiple times, a range with reference to what determines what amount, the
                    contracts balance at time of claim.
                    {/* contracts balance at time of claim. This shouldn’t be a percentage of the
                        contracts balance, as claims are not guaranteed to happen in order as they
                        can be cancelled, messing up the valid claim amounts. */}
                  </div>
                }
                onChange={handleChange}
                wide
                multiline
                isMarkDown
                maxLine={questMode === ENUM_QUEST_VIEW_MODE.ReadSummary ? 10 : undefined}
                ellipsis={
                  <LinkStyled to={`/${ENUM_PAGES.Detail}?id=${data.address}`}>Read more</LinkStyled>
                }
              />
              {isEdit && (
                <FallbackWrapperStyled>
                  <div style={{ width: '80%' }}>
                    <AddressFieldInput
                      id="fallbackAddress"
                      label="Funds fallback address"
                      value={values.fallbackAddress}
                      isLoading={loading}
                      tooltip="Fallback Address"
                      tooltipDetail="Unused funds at the specified expiry time can be returned to this address"
                      isEdit
                      onChange={handleChange}
                    />
                  </div>
                </FallbackWrapperStyled>
              )}
            </Outset>
          </Outset>
        }
        secondary={
          <Outset horizontal gu16={!isEdit}>
            {bounty !== null && (
              <AmountFieldInputFormik
                id="bounty"
                label={
                  questMode === ENUM_QUEST_VIEW_MODE.Create ? 'Initial bounty' : 'Available bounty'
                }
                isEdit={isEdit}
                tooltip="Bounty"
                tooltipDetail={
                  isEdit
                    ? "The initial amount of this quest's funding pool."
                    : "The available amount of this quest's funding pool."
                }
                value={bounty}
                isLoading={loading || (!isEdit && !bounty)}
                formik={formRef}
              />
            )}
            {questMode === ENUM_QUEST_VIEW_MODE.ReadDetail && claimDeposit !== null && (
              <AmountFieldInput
                id="claimDeposit"
                label="Claim deposit"
                tooltip="Claim deposit"
                tooltipDetail="This amount will be staked when claiming a bounty. If the claim is successfully challenged, you will lose this deposit."
                value={claimDeposit}
                isLoading={loading || (!isEdit && !claimDeposit)}
              />
            )}
            <DateFieldInput
              id="expireTimeMs"
              label="Expire time"
              tooltip="Expire time"
              tooltipDetail="The expiry time for the quest completion. Funds will return to the fallback address when the expiry time is reached."
              isEdit={isEdit}
              isLoading={loading}
              value={values.expireTimeMs}
              onChange={handleChange}
            />
          </Outset>
        }
      />
      {!loading && !isEdit && data.address && (
        <>
          {questMode === ENUM_QUEST_VIEW_MODE.ReadDetail && claims && challengeDeposit && (
            <ClaimList
              claims={claims}
              questTotalBounty={bounty}
              challengeDeposit={challengeDeposit}
            />
          )}
          <QuestFooterStyled>
            {/* {questMode !== ENUM_QUEST_VIEW_MODE.ReadDetail && (
              // <LinkStyled to={`/${ENUM_PAGES.Detail}?id=${values.address}`}>
              //   <Button icon={<IconPlus />} label="Details" wide mode="strong" />
              // </LinkStyled>
            )} */}
            {questMode !== ENUM_QUEST_VIEW_MODE.ReadSummary &&
              values.address &&
              wallet.account &&
              bounty &&
              (values.state === ENUM_QUEST_STATE.Active ? (
                <>
                  <FundModal questAddress={values.address} />
                  {currentPlayerClaim ? (
                    <ExecuteClaimModal claim={currentPlayerClaim} questTotalBounty={bounty} />
                  ) : (
                    claimDeposit && (
                      <ScheduleClaimModal
                        questAddress={data.address}
                        questTotalBounty={bounty}
                        claimDeposit={claimDeposit}
                        playerAddress={wallet.account}
                      />
                    )
                  )}
                </>
              ) : (
                !!bounty?.parsedAmount && <ReclaimFundsModal bounty={bounty} questData={values} />
              ))}
          </QuestFooterStyled>
        </>
      )}
    </>
  );

  return (
    <CardStyled
      style={css}
      isSummary={questMode === ENUM_QUEST_VIEW_MODE.ReadSummary}
      id={data.address}
    >
      {!loading && <StateTag state={data.state} />}
      <Formik
        initialValues={
          { ...data, fallbackAddress: data.fallbackAddress ?? wallet.account } as QuestModel
        }
        onSubmit={(values, { setSubmitting }) => onQuestSubmit(values, setSubmitting)}
      >
        {({ values, handleChange, handleSubmit }) =>
          isEdit ? (
            <FormStyled
              onSubmit={handleSubmit}
              ref={formRef}
              id={`form-quest-form-${data.address ?? 'new'}`}
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
