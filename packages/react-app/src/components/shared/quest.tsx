import { AddressField, Button, Card, GU, IconPlus, Split, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { PAGES, QUEST_MODE, QUEST_SUMMARY_MAX_CHARACTERS } from 'src/constants';
import { getBalanceOf, useERC20Contract, useFactoryContract } from 'src/hooks/use-contract.hook';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import * as QuestService from 'src/services/quest.service';
import { IN_A_WEEK_IN_MS, ONE_HOUR_IN_MS } from 'src/utils/date.utils';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { fetchClaimDeposit } from 'src/services/quest.service';
import ClaimModal from '../modals/claim-modal';
import FundModal from '../modals/fund-modal';
import DateFieldInput from './field-input/date-field-input';
import { ChildSpacer, Outset } from './utils/spacer-util';
import AmountFieldInput, { AmountFieldInputFormik } from './field-input/amount-field-input';
import TextFieldInput from './field-input/text-field-input';
import IdentityBadge from './identity-badge';
import ClaimList from './claim-list';
// #region StyledComponents

const LinkStyled = styled(Link)`
  text-decoration: none;
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
  padding: ${1 * GU}px;
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
  data?: QuestModel;
  questMode?: string;
  isLoading?: boolean;
  onSave?: Function;
  css?: any;
};

export default function Quest({
  data = {
    title: '',
    description: '',
    expireTimeMs: IN_A_WEEK_IN_MS + 24 * 36000,
  },
  isLoading = false,
  questMode = QUEST_MODE.ReadDetail,
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
  const [claimDeposit, setClaimDeposit] = useState<TokenAmountModel | null>();
  const toast = useToast();
  const questFactoryContract = useFactoryContract();

  useEffect(() => {
    setIsEdit(questMode === QUEST_MODE.Create || questMode === QUEST_MODE.Update);
  }, [questMode]);

  useEffect(() => {
    const getBalanceOfQuest = async (address: string) => {
      try {
        const result = await getBalanceOf(defaultToken, address);
        setBounty(result);
      } catch (error) {
        Logger.error(error);
      }
    };
    if (data.address) getBalanceOfQuest(data.address);
  }, [wallet.account]);

  useEffect(() => {
    const getClaimDeposit = async () => {
      try {
        setClaimDeposit(await fetchClaimDeposit());
      } catch (error) {
        Logger.error(error);
      }
    };
    getClaimDeposit();
  }, []);

  const questContent = (questData: QuestModel, handleChange = noop) => (
    <>
      <Split
        primary={
          <Outset gu16>
            <Outset gu8 vertical className="block">
              <Split
                primary={
                  <TextFieldInput
                    id="title"
                    label={isEdit ? 'Title' : undefined}
                    isEdit={isEdit}
                    isLoading={loading}
                    placeHolder="Quest title"
                    value={questData.title}
                    onChange={handleChange}
                    fontSize="24px"
                    wide
                  />
                }
                secondary={
                  !isEdit &&
                  questData.address &&
                  (loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      <AddressField id="address" address={questData.address} autofocus={false} />
                    </>
                  ))
                }
              />
            </Outset>
            <Outset gu8 vertical>
              <TextFieldInput
                id="description"
                label={isEdit ? 'Description' : undefined}
                maxLength={
                  questMode === QUEST_MODE.ReadSummary ? QUEST_SUMMARY_MAX_CHARACTERS : undefined
                }
                value={questData.description}
                isEdit={isEdit}
                isLoading={loading}
                placeHolder="Quest description"
                onChange={handleChange}
                wide
                multiline
                autoLinks
                css={{ height: '100px', whiteSpace: 'pre-wrap' }}
              />
              {isEdit && (
                <>
                  <TextFieldInput
                    id="fallbackAddress"
                    label="Funds fallback address"
                    value={questData.fallbackAddress}
                    isLoading={loading}
                    isEdit
                    placeHolder="Funds fallback address"
                    onChange={handleChange}
                    wide
                  />
                  {!loading && questData.fallbackAddress && (
                    <IdentityBadge entity={questData.fallbackAddress} badgeOnly />
                  )}
                </>
              )}
            </Outset>
          </Outset>
        }
        secondary={
          <Outset gu16={questMode !== QUEST_MODE.Create && questMode !== QUEST_MODE.Update}>
            {bounty !== null && (
              <AmountFieldInputFormik
                id="bounty"
                label={questMode === QUEST_MODE.Create ? 'Initial bounty' : 'Available bounty'}
                isEdit={isEdit}
                value={bounty}
                isLoading={loading || (!isEdit && !bounty)}
                formik={formRef}
              />
            )}
            {!isEdit && claimDeposit !== null && (
              <AmountFieldInput
                id="claimDeposit"
                label="Claim deposit"
                isEdit={false}
                value={claimDeposit}
                isLoading={loading || (!isEdit && !claimDeposit)}
              />
            )}
            {/* {(!!values.tags?.length || editMode) && (
                    <TagFieldInputFormik
                      id="tags"
                      label="Tags"
                      isEdit={editMode}
                      isLoading={loading}
                      value={values.tags}
                      formik={formRef}
                      // onTagClick={(x: String[]) => Logger.debug('Tag clicked : ', x)} // TODO : Restore filter by tag on tag click
                    />
                  )} TODO : No tags for MVP */}
            <DateFieldInput
              id="expireTimeMs"
              label="Expire time"
              isEdit={isEdit}
              isLoading={loading}
              value={questData.expireTimeMs}
              onChange={handleChange}
            />
          </Outset>
        }
      />
      {!loading && !isEdit && (
        <>
          {questMode === QUEST_MODE.ReadDetail && <ClaimList quest={data} />}
          <QuestFooterStyled>
            <Outset gu8 vertical>
              {questMode !== QUEST_MODE.ReadDetail && (
                <ChildSpacer>
                  <LinkStyled to={`/${PAGES.Detail}?id=${questData.address}`}>
                    <Button icon={<IconPlus />} label="Details" wide mode="strong" />
                  </LinkStyled>
                </ChildSpacer>
              )}
              {questMode !== QUEST_MODE.ReadSummary && questData.address && wallet.account && (
                <ChildSpacer>
                  <FundModal questAddress={questData.address} />
                  {claimDeposit && (
                    <ClaimModal questAddress={questData.address} claimDeposit={claimDeposit} />
                  )}
                </ChildSpacer>
              )}
            </Outset>
          </QuestFooterStyled>
        </>
      )}
    </>
  );

  return (
    <CardStyled style={css} isSummary={questMode === QUEST_MODE.ReadSummary} id={data.address}>
      <Formik
        initialValues={{ fallbackAddress: wallet.account, ...data }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.description) errors.push('Description is required');
          if (!values.title) errors.push('Title is required');
          if (!values.fallbackAddress) errors.push('Funds fallback address is required');
          if (values.expireTimeMs < Date.now()) errors.push('Expiration have to be later than now');

          if (errors.length) {
            errors.forEach(toast);
          } else {
            setTimeout(async () => {
              setLoading(true);
              try {
                // Set noon to prevent rounding form changing date
                const timeValue =
                  new Date(values.expireTimeMs ?? 0).getTime() + 12 * ONE_HOUR_IN_MS;
                toast('Quest creating ...');
                if (!questFactoryContract) {
                  Logger.error(
                    'QuestFactory contract was not loaded correctly (maybe account is disabled)',
                  );
                }
                const createdQuestAddress = await QuestService.saveQuest(
                  questFactoryContract,
                  values.fallbackAddress!,
                  { ...values, expireTimeMs: timeValue, creatorAddress: wallet.account },
                );
                if (!createdQuestAddress) throw Error();
                if (values.bounty?.amount) {
                  toast('Quest funding ...');
                  await QuestService.fundQuest(erc20Contract, createdQuestAddress, values.bounty);
                }
                toast('Quest created successfully');
                onSave(createdQuestAddress);
              } catch (e: any) {
                Logger.error(e);
                toast(
                  !e?.message || e.message.includes('\n') || e.message.length > 75
                    ? 'Oops. Something went wrong.'
                    : e.message,
                );
              }

              setSubmitting(false);
              setLoading(false);
            }, 0);
          }
        }}
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
