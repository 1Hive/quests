import { AddressField, Button, Card, GU, IconPlus, Split, useToast } from '@1hive/1hive-ui';
import { BigNumber } from 'ethers';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import {
  DEFAULT_AMOUNT,
  DEFAULT_TOKEN,
  PAGES,
  QUEST_MODE,
  QUEST_SUMMARY_MAX_CHARACTERS,
} from 'src/constants';
import { useERC20Contract, useFactoryContract } from 'src/hooks/use-contract.hook';
import { QuestData } from 'src/models/quest-data';
import { TokenAmount } from 'src/models/token-amount';
import * as QuestService from 'src/services/quest.service';
import { IN_A_WEEK_IN_MS, ONE_HOUR_IN_MS } from 'src/utils/date.utils';
import { Logger } from 'src/utils/logger';
import { fromBigNumber } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import * as Yup from 'yup';
import ClaimModal from '../modals/claim-modal';
import FundModal from '../modals/fund-modal';
import DateFieldInput from './field-input/date-field-input';
import TextFieldInput from './field-input/text-field-input';
import IdentityBadge from './identity-badge';
import { ChildSpacer, Outset } from './utils/spacer-util';
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
  data?: QuestData;
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
  const questFactoryContract = useFactoryContract();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(isLoading);
  const [isEdit, setIsEdit] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [bounty, setBounty] = useState<TokenAmount>();
  const [claimDeposit, setClaimDeposit] = useState(DEFAULT_AMOUNT);
  const toast = useToast();
  let erc20Contract: any;

  const refreshBounty = () =>
    erc20Contract
      ?.balanceOf(data.address)
      .then((x: BigNumber) => {
        setBounty({
          token: DEFAULT_TOKEN,
          amount: fromBigNumber(x, DEFAULT_TOKEN.decimals),
        });
      })
      .catch(Logger.error);

  useEffect(() => {
    setIsEdit(questMode === QUEST_MODE.Create || questMode === QUEST_MODE.Update);
  }, [questMode]);

  if (data) {
    erc20Contract = useERC20Contract(DEFAULT_TOKEN);

    useEffect(() => {
      refreshBounty()?.then(() =>
        setClaimDeposit({
          // TODO : Fetch from Govern subgraph
          amount: 2,
          token: DEFAULT_TOKEN,
        }),
      );
    }, [erc20Contract]);
  }

  return (
    <CardStyled style={css} isSummary={questMode === QUEST_MODE.ReadSummary} id={data.address}>
      <Formik
        initialValues={{ fallbackAddress: wallet.account, claimDeposit, ...data }}
        validateOnBlur
        validationSchema={Yup.object().shape({
          description: Yup.string().required(),
          title: Yup.string().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            setLoading(true);
            try {
              // Set noon to prevent rounding form changing date
              const timeValue = new Date(values.expireTimeMs ?? 0).getTime() + 12 * ONE_HOUR_IN_MS;
              toast('Quest creating ...');
              const createdQuestAddress = await QuestService.saveQuest(
                questFactoryContract,
                values.fallbackAddress!,
                { ...values, expireTimeMs: timeValue, creatorAddress: wallet.account },
              );
              if (values.bounty?.amount) {
                toast('Quest funding ...');
                await QuestService.fundQuest(erc20Contract, createdQuestAddress, values.bounty);
              }
              toast('Quest created successfully');
              onSave(createdQuestAddress);
            } catch (e: any) {
              Logger.error(e);
              toast(
                e.message.includes('\n') || e.message.length > 50
                  ? 'Oops. Something went wrong.'
                  : e.message,
              );
            }

            setSubmitting(false);
            setLoading(false);
          }, 400);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <FormStyled
            onSubmit={handleSubmit}
            ref={formRef}
            id={`quest-form-${data.address ?? 'new'}`}
          >
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
                          value={values.title}
                          onChange={handleChange}
                          fontSize="24px"
                          wide
                        />
                      }
                      secondary={
                        !isEdit &&
                        data.address &&
                        (loading ? (
                          <Skeleton />
                        ) : (
                          <>
                            <AddressField id="address" address={data.address} autofocus={false} />
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
                        questMode === QUEST_MODE.ReadSummary
                          ? QUEST_SUMMARY_MAX_CHARACTERS
                          : undefined
                      }
                      value={values.description}
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
                          value={values.fallbackAddress}
                          isLoading={loading}
                          isEdit
                          placeHolder="Funds fallback address"
                          onChange={handleChange}
                          wide
                        />
                        {!loading && <IdentityBadge entity={values.fallbackAddress} badgeOnly />}
                      </>
                    )}
                  </Outset>
                </Outset>
              }
              secondary={
                <Outset gu16>
                  {/* <AmountFieldInputFormik
                    id="bounty"
                    label={questMode === QUEST_MODE.Create ? 'Initial bounty' : 'Available bounty'}
                    isEdit={isEdit}
                    value={bounty}
                    isLoading={loading || (!isEdit && !bounty)}
                    formik={formRef}
                  /> */}
                  {/* {!isEdit && (
                    <AmountFieldInput
                      id="claimDeposit"
                      label="Claim deposit"
                      isEdit={false}
                      value={claimDeposit || (!isEdit && !claimDeposit)}
                      isLoading={loading}
                    />
                  )} */}
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
                    value={values.expireTimeMs}
                    onChange={handleChange}
                  />
                </Outset>
              }
            />
            {!loading && !isEdit && (
              <QuestFooterStyled>
                <Outset gu8 vertical>
                  {questMode !== QUEST_MODE.ReadDetail && (
                    <ChildSpacer>
                      <LinkStyled to={`/${PAGES.Detail}?id=${data.address}`}>
                        <Button icon={<IconPlus />} label="Details" wide mode="strong" />
                      </LinkStyled>
                    </ChildSpacer>
                  )}
                  {questMode !== QUEST_MODE.ReadSummary && wallet.account && (
                    <ChildSpacer>
                      <FundModal questAddress={data.address!} />
                      <ClaimModal questAddress={data.address!} />
                    </ChildSpacer>
                  )}
                </Outset>
              </QuestFooterStyled>
            )}
          </FormStyled>
        )}
      </Formik>
    </CardStyled>
  );
}
