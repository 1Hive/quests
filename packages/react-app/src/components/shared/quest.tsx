import { AddressField, Button, Card, Field, GU, LoadingRing, Split } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useRef, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { TOKENS } from 'src/constants';
import { useFactoryContract } from 'src/hooks/useContract';
import { Fund as Fundation } from 'src/models/fund';
import { QuestData } from 'src/models/quest-data';
import { TokenAmount } from 'src/models/token-amount';
import * as QuestService from 'src/services/quest-service';
import { IN_A_WEEK_IN_MS } from 'src/utils/date-utils';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import FundModal from '../modals/fund-modal';
import PlayModal from '../modals/play-modal';
import { AmountFieldInputFormik } from './field-input/amount-field-input';
import DateFieldInput from './field-input/date-field-input';
import NumberFieldInput from './field-input/number-field-input';
import { TagFieldInputFormik } from './field-input/tag-field-input';
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
  collateralPercentage?: number;
  tags?: string[];
  address?: string;
  css?: any;
  isEdit?: boolean;
  isLoading?: boolean;
  onSave?: Function;
  players?: string[];
  funds?: Fundation[];
  creatorAddress?: string;
  onFilterChange?: Function;
  expireTimeMs?: number;
};

export default function Quest({
  title,
  description,
  bounty = { amount: 0, token: TOKENS.honey },
  collateralPercentage = 0,
  tags = [],
  address = '',
  expireTimeMs = IN_A_WEEK_IN_MS,
  isEdit = false,
  isLoading = false,
  creatorAddress = '',
  players = [],
  funds = [],
  onSave = noop,
  css,
  onFilterChange = noop,
}: Props) {
  const wallet = useWallet();
  const questFactoryContract = useFactoryContract();
  const formRef = useRef(null);
  const [editMode, setEditMode] = useState(isEdit);
  const [loading, setLoading] = useState(isLoading);
  const alreadyPlayed = !!players.find((x) => x === wallet.account);
  return (
    <CardStyled style={css} id={address}>
      <Formik
        initialValues={
          {
            title,
            description,
            bounty,
            collateralPercentage,
            tags,
            fallbackAddress: wallet.account,
            expireTimeMs,
          } as Partial<QuestData>
        }
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            setLoading(true);
            onSave(
              await QuestService.saveQuest(
                questFactoryContract,
                values.fallbackAddress ?? wallet.account,
                values,
              ),
            );
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
                          label={editMode ? 'Title' : ''}
                          isEdit={editMode}
                          isLoading={loading}
                          placeHolder="Quest title"
                          value={values.title}
                          onChange={handleChange}
                          fontSize="24px"
                          wide
                        />
                      }
                      secondary={
                        !editMode &&
                        (loading ? (
                          <Skeleton />
                        ) : (
                          <AddressField id="address" address={address} autofocus={false} />
                        ))
                      }
                    />
                  </Outset>
                  <Outset gu8 vertical>
                    <TextFieldInput
                      id="description"
                      label={editMode ? 'Description' : ''}
                      value={values.description}
                      isEdit={editMode}
                      isLoading={loading}
                      placeHolder="Quest description"
                      onChange={handleChange}
                      wide
                      multiline
                      css={{ height: '100px' }}
                    />
                    {editMode && (
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
                      <Field label="Patrons">{loading ? <Skeleton /> : funds.length}</Field>
                      <Field label="Players">{loading ? <Skeleton /> : players.length}</Field>
                    </>
                  )}
                  <AmountFieldInputFormik
                    id="bounty"
                    label="Bounty"
                    isEdit={editMode}
                    value={values.bounty}
                    isLoading={loading}
                    formik={formRef}
                  />
                  <NumberFieldInput
                    id="collateral"
                    label="Collateral"
                    onChange={handleChange}
                    isEdit={editMode}
                    value={values.collateralPercentage}
                    isLoading={loading}
                    suffix="%"
                  />
                  {!!values.tags?.length && (
                    <TagFieldInputFormik
                      id="tags"
                      label="Tags"
                      isEdit={editMode}
                      isLoading={loading}
                      value={values.tags}
                      formik={formRef}
                      onTagClick={(tag: string) => onFilterChange({ tags: [tag] })}
                    />
                  )}
                  <DateFieldInput
                    id="expireDate"
                    label="Expire time"
                    isEdit={editMode}
                    isLoading={loading}
                    value={values.expireTimeMs}
                    onChange={handleChange}
                  />
                </Outset>
              }
            />
            <QuestFooterStyled>
              {editMode ? (
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
                        <Button onClick={() => setEditMode(true)} label="Edit" icon={<FaEdit />} />
                      )}
                      <PlayModal questAddress={address} disabled={alreadyPlayed} />
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
