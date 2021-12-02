import {
  AddressField,
  Button,
  Card,
  Field,
  GU,
  LoadingRing,
  Split,
  useToast,
} from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { QUEST_MODE, TOKENS } from 'src/constants';
import { useFactoryContract } from 'src/hooks/use-contract.hook';
import { QuestData } from 'src/models/quest-data';
import { TokenAmount } from 'src/models/token-amount';
import * as QuestService from 'src/services/quest.service';
import { IN_A_WEEK_IN_MS } from 'src/utils/date.utils';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import ClaimModale from '../modals/claim-modal';
import FundModal from '../modals/fund-modal';
import AmountFieldInput, { AmountFieldInputFormik } from './field-input/amount-field-input';
import DateFieldInput from './field-input/date-field-input';
import TextFieldInput from './field-input/text-field-input';
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

const QuestActionButtonStyled = styled(Button)`
  margin: ${1 * GU}px;
`;

const FormStyled = styled(Form)`
  width: 100%;
  #description {
    height: 200px;
  }
`;

// #endregion

type Props = {
  title?: string;
  description?: string;
  bounty?: TokenAmount;
  claimDeposit?: TokenAmount;
  tags?: string[];
  address?: string;
  css?: any;
  questMode?: string;
  isLoading?: boolean;
  onSave?: Function;
  players?: string[];
  creatorAddress?: string;
  expireTimeMs?: number;
};

export default function Quest({
  title,
  description,
  bounty = { amount: 0, token: TOKENS.honey },
  claimDeposit,
  tags = [],
  address = '',
  expireTimeMs = IN_A_WEEK_IN_MS,
  questMode = QUEST_MODE.CREATE,
  isLoading = false,
  creatorAddress = '',
  players = [],
  onSave = noop,
  css,
}: Props) {
  const wallet = useWallet();
  const questFactoryContract = useFactoryContract();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(isLoading);
  const [isEdit, setIsEdit] = useState(questMode !== QUEST_MODE.READ);
  const toast = useToast();
  const alreadyPlayed = !!players.find((x) => x === wallet.account);

  useEffect(() => setIsEdit(questMode !== QUEST_MODE.READ), [questMode]);

  return (
    <CardStyled style={css} id={address}>
      <Formik
        initialValues={
          {
            title,
            description,
            bounty,
            claimDeposit,
            tags,
            fallbackAddress: wallet.account,
            expireTimeMs,
          } as Partial<QuestData>
        }
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            setLoading(true);
            try {
              const timeValue = new Date(values.expireTimeMs ?? 0).getTime();
              const saveResponse = await QuestService.saveQuest(
                questFactoryContract,
                values.fallbackAddress ?? wallet.account,
                { ...values, expireTimeMs: timeValue },
              );
              onSave(saveResponse);
            } catch (e: any) {
              toast(e.message);
            }

            setSubmitting(false);
            setLoading(false);
          }, 400);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <FormStyled onSubmit={handleSubmit} ref={formRef}>
            <Split
              primary={
                <Outset gu16>
                  <Outset gu8 vertical className="block">
                    <Split
                      primary={
                        <TextFieldInput
                          id="title"
                          label={isEdit ? 'Title' : ''}
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
                        (loading ? (
                          <Skeleton />
                        ) : (
                          <>
                            <AddressField id="address" address={address} autofocus={false} />
                          </>
                        ))
                      }
                    />
                  </Outset>
                  <Outset gu8 vertical>
                    <TextFieldInput
                      id="description"
                      label={isEdit ? 'Description' : ''}
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
                    )}
                  </Outset>
                </Outset>
              }
              secondary={
                <Outset gu16>
                  {!isEdit && (
                    <>
                      {/* <Field label="Patrons">{loading ? <Skeleton /> : funds.length}</Field> TODO : Restore after MVP */}
                      <Field label="Players">{loading ? <Skeleton /> : players.length}</Field>
                    </>
                  )}
                  <AmountFieldInputFormik
                    id="bounty"
                    label={questMode === QUEST_MODE.CREATE ? 'Initial bounty' : 'Available bounty'}
                    isEdit={questMode === QUEST_MODE.CREATE}
                    value={values.bounty}
                    isLoading={loading}
                    formik={formRef}
                  />
                  {questMode !== QUEST_MODE.CREATE && (
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
                      // onTagClick={(x: String[]) => log('Tag clicked : ', x)} // TODO : Restore filter by tag on tag click
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
            <QuestFooterStyled>
              {isEdit ? (
                <QuestActionButtonStyled
                  label="Save"
                  icon={loading ? <LoadingRing /> : <FaSave />}
                  mode="positive"
                  type="submit"
                />
              ) : (
                wallet.account && (
                  <Outset gu8 vertical>
                    <ChildSpacer>
                      {creatorAddress === wallet.account && (
                        <Button onClick={() => setIsEdit(true)} label="Edit" icon={<FaEdit />} />
                      )}
                      <ClaimModale questAddress={address} disabled={alreadyPlayed} />
                      <FundModal questAddress={address} />
                    </ChildSpacer>
                  </Outset>
                )
              )}
            </QuestFooterStyled>
          </FormStyled>
        )}
      </Formik>
    </CardStyled>
  );
}
