/* eslint-disable react/no-children-prop */
import { AddressField, Button, Card, Field, GU, Split } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { QUEST_STATUS, TOKENS } from '../../../constants';
import { useFactoryContract } from '../../../hooks/useContract';
import QuestProvider from '../../../services/QuestService';
import FundModal from '../../modals/FundModal';
import PlayModal from '../../modals/PlayModal';
import { AmountFieldInputFormik } from '../field-input/AmountFieldInput';
import NumberFieldInput from '../field-input/NumberFieldInput';
import { TagFieldInputFormik } from '../field-input/TagFieldInput';
import TextFieldInput from '../field-input/TextFieldInput';
import { ChildSpacer, Outset } from '../utils/spacer-util';

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

const defaultMeta = {
  title: null,
  description: null,
  bounty: { amount: 0, token: TOKENS.honey },
  collateral: 0,
  tags: [],
};

export default function Quest({
  meta = defaultMeta,
  address = '',
  isEdit = false,
  status = QUEST_STATUS.draft,
  isLoading = false,
  players = [],
  funds = [],
  creator = undefined,
  onSave = noop,
  css,
  onFilterChange = noop,
}) {
  const wallet = useWallet();
  const questFactoryContract = useFactoryContract();
  const formRef = useRef(null);
  const [editMode, setEditMode] = useState(isEdit);
  const alreadyPlayed = !!players.find((x) => x === wallet.account);
  return (
    <CardStyled style={css} id={address}>
      <Formik
        initialValues={{
          title: meta.title,
          description: meta.description,
          bounty: meta.bounty,
          collateral: meta.collateral,
          tags: meta.tags,
          fallbackAddress: wallet.account,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            setSubmitting(false);
            onSave(
              await QuestProvider.saveQuest(questFactoryContract, values.fallbackAddress, values),
            );
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
                          isLoading={isLoading}
                          placeHolder="Quest title"
                          value={values.title}
                          onChange={handleChange}
                          fontSize="24px"
                          wide
                        />
                      }
                      secondary={
                        !editMode &&
                        (isLoading ? (
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
                      isLoading={isLoading}
                      placeHolder="Quest description"
                      onChange={handleChange}
                      wide
                      multiline
                      css={{ height: '100px' }}
                    />
                    {editMode && (
                      <AddressField
                        id="fallbackAddress"
                        label="Funds fallback address"
                        value={values.fallbackAddress}
                        isLoading={isLoading}
                        placeHolder="Funds fallback address"
                        onChange={handleChange}
                      />
                    )}
                  </Outset>
                </Outset>
              }
              secondary={
                <Outset gu16>
                  {!isEdit && (
                    <>
                      <Field label="Status">{isLoading ? <Skeleton /> : status.label}</Field>
                      <Field label="Patrons">{isLoading ? <Skeleton /> : funds.length}</Field>
                      <Field label="Players">{isLoading ? <Skeleton /> : players.length}</Field>
                    </>
                  )}
                  <AmountFieldInputFormik
                    id="bounty"
                    label="Bounty"
                    isEdit={editMode}
                    value={values.bounty}
                    isLoading={isLoading}
                    formik={formRef}
                  />
                  <NumberFieldInput
                    id="collateral"
                    label="Collateral"
                    onChange={handleChange}
                    isEdit={editMode}
                    value={values.collateral}
                    isLoading={isLoading}
                    suffix="%"
                  />
                  <TagFieldInputFormik
                    id="tags"
                    label="Tags"
                    isEdit={editMode}
                    isLoading={isLoading}
                    value={values.tags}
                    formik={formRef}
                    onTagClick={(tag) => onFilterChange({ tags: [tag] })}
                  />
                </Outset>
              }
            />
            <QuestFooterStyled>
              {editMode ? (
                <QuestActionButtonStyled
                  label="Save"
                  icon={<FaSave />}
                  mode="positive"
                  type="submit"
                />
              ) : (
                wallet.account && (
                  <Outset gu8 vertical>
                    <ChildSpacer>
                      {creator === wallet.account && (
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

Quest.propTypes = {
  address: PropTypes.string,
  css: PropTypes.any,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  meta: PropTypes.shape({
    bounty: PropTypes.shape({
      amount: PropTypes.number,
      token: PropTypes.shape({
        address: PropTypes.string,
        name: PropTypes.string,
        symb: PropTypes.string,
      }),
    }),
    collateral: PropTypes.number,
    description: PropTypes.string,
    tags: PropTypes.array,
    title: PropTypes.string,
  }),
  onSave: PropTypes.func,
  players: PropTypes.array,
  funds: PropTypes.array,
  status: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  }),
  totalFunds: PropTypes.shape({
    amount: PropTypes.number,
    token: PropTypes.any,
  }),
};
