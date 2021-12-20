import { AddressField, Button, Card, GU, IconPlus, Split, useToast } from '@1hive/1hive-ui';
import { BigNumber } from 'ethers';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { DEFAULT_AMOUNT, QUEST_MODE } from 'src/constants';
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
import { AmountFieldInputFormik } from './field-input/amount-field-input';
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
  width: 100% !important;
  height: 100% !important;
  border: none !important;
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
  questMode = QUEST_MODE.READ_DETAIL,
  onSave = noop,
  css,
}: Props) {
  const wallet = useWallet();
  const questFactoryContract = useFactoryContract();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(isLoading);
  const [isEdit, setIsEdit] = useState(false);
  const [bounty, setBounty] = useState<TokenAmount>();
  const [claimDeposit, setClaimDeposit] = useState(DEFAULT_AMOUNT);
  const toast = useToast();
  let erc20Contract: any;

  useEffect(() => {
    setIsEdit(questMode === QUEST_MODE.CREATE || questMode === QUEST_MODE.UPDATE);
  }, [questMode]);

  if (data) {
    erc20Contract = useERC20Contract(DEFAULT_AMOUNT.token);

    useEffect(() => {
      erc20Contract
        ?.balanceOf(data.address)
        .then((x: BigNumber) => {
          setBounty({
            token: DEFAULT_AMOUNT.token,
            amount: fromBigNumber(x, DEFAULT_AMOUNT.token.decimals),
          });
        })
        .catch(Logger.error);
    }, [erc20Contract]);
  }

  return (
    <CardStyled style={css} isSummary={questMode === QUEST_MODE.READ_SUMMARY} id={data.address}>
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
              const saveResponse = await QuestService.saveQuest(
                questFactoryContract,
                values.fallbackAddress!,
                { ...values, expireTimeMs: timeValue, creatorAddress: wallet.account },
              );
              toast('Quest is being proceed and will appear in the list in a few minutes ...');
              onSave(saveResponse);
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
                      maxLength={questMode === QUEST_MODE.READ_SUMMARY ? 300 : undefined}
                      value={values.description}
                      isEdit={isEdit}
                      isLoading={loading}
                      placeHolder="Quest description"
                      onChange={handleChange}
                      wide
                      multiline
                      autoLinks
                      css={{ height: '100px' }}
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
                  <AmountFieldInputFormik
                    id="bounty"
                    label={questMode === QUEST_MODE.CREATE ? 'Initial bounty' : 'Available bounty'}
                    isEdit={isEdit}
                    value={bounty}
                    isLoading={loading || !bounty}
                    formik={formRef}
                  />
                  {/* {!isEdit && (
                    <AmountFieldInput
                      id="claimDeposit"
                      label="Claim deposit"
                      onChange={handleChange}
                      isEdit={false}
                      value={values.claimDeposit}
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
                  {questMode !== QUEST_MODE.READ_DETAIL && (
                    <ChildSpacer>
                      <LinkStyled to={`/detail?id=${data.address}`}>
                        <Button icon={<IconPlus />} label="Details" wide mode="strong" />
                      </LinkStyled>
                    </ChildSpacer>
                  )}
                  {questMode !== QUEST_MODE.READ_SUMMARY && wallet.account && (
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
