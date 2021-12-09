import { AddressField, Card, GU, Split, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_AMOUNT, QUEST_MODE } from 'src/constants';
import { useFactoryContract } from 'src/hooks/use-contract.hook';
import { QuestData } from 'src/models/quest-data';
import * as QuestService from 'src/services/quest.service';
import { IN_A_WEEK_IN_MS, ONE_HOUR_IN_MS } from 'src/utils/date.utils';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import QuestModal from '../modals/quest-modal';
import AmountFieldInput, { AmountFieldInputFormik } from './field-input/amount-field-input';
import DateFieldInput from './field-input/date-field-input';
import TextFieldInput from './field-input/text-field-input';
import IdentityBadge from './identity-badge';
import { ChildSpacer, Outset } from './utils/spacer-util';

// #region StyledComponents

const CardStyled = styled(Card)`
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
    bounty: DEFAULT_AMOUNT,
    claimDeposit: DEFAULT_AMOUNT,
  },
  isLoading = false,
  questMode = QUEST_MODE.READ_SUMMARY,
  onSave = noop,
  css,
}: Props) {
  const wallet = useWallet();
  const questFactoryContract = useFactoryContract();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(isLoading);
  const [isEdit, setIsEdit] = useState(false);
  const toast = useToast();

  useEffect(
    () => setIsEdit(questMode === QUEST_MODE.CREATE || questMode === QUEST_MODE.UPDATE),
    [questMode],
  );

  return (
    <CardStyled style={css} id={data.address}>
      <Formik
        initialValues={{ fallbackAddress: wallet.account, ...data }}
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
                      value={values.description}
                      isEdit={isEdit}
                      isLoading={loading}
                      placeHolder="Quest description"
                      onChange={handleChange}
                      wide
                      multiline
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
                    value={values.bounty}
                    isLoading={loading}
                    formik={formRef}
                  />
                  {!isEdit && (
                    <AmountFieldInput
                      id="claimDeposit"
                      label="Claim deposit"
                      onChange={handleChange}
                      isEdit={false}
                      value={values.claimDeposit}
                      isLoading={loading}
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
                    value={values.expireTimeMs}
                    onChange={handleChange}
                  />
                </Outset>
              }
            />
            {!loading && !isEdit && wallet.account && questMode !== QUEST_MODE.READ_DETAIL && (
              <QuestFooterStyled>
                <Outset gu8 vertical>
                  <ChildSpacer>
                    <QuestModal data={data} questMode={QUEST_MODE.READ_DETAIL} onClose={noop} />
                  </ChildSpacer>
                </Outset>
              </QuestFooterStyled>
            )}
          </FormStyled>
        )}
      </Formik>
    </CardStyled>
  );
}
