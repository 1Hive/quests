import PropTypes from 'prop-types';
import { AddressField, Button, Card, Field, GU, Split } from '@1hive/1hive-ui';
import React, { useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { FaDollarSign, FaPlay, FaSave } from 'react-icons/fa';
import { Form, Formik } from 'formik';
import { CRYPTOS, QUEST_STATUS } from '../../../constants';
import { Spacer16, Spacer8V } from '../Utils/Spacer';
import AmountFieldInput from '../FieldInput/AmountFieldInput';
import TextFieldInput from '../FieldInput/TextFieldInput';
import { saveQuest } from '../../../providers/QuestProvider';
import { emptyFunc } from '../../../utils/class-util';
import TagFieldInput from '../FieldInput/TagFieldInput';
import NumberFieldInput from '../FieldInput/NumberFieldInput';

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

const defaultData = {
  title: null,
  description: null,
  maxPlayers: -1,
  bounty: { amount: 0, token: CRYPTOS.questgold },
  collateral: { amount: 0, token: CRYPTOS.questgold },
  tags: [],
};

export default function Quest({
  data = defaultData,
  address,
  isEdit = false,
  status = QUEST_STATUS.draft,
  isLoading = false,
  players = 0,
  onSave = emptyFunc,
  css,
}) {
  const formRef = useRef(undefined);
  return (
    <CardStyled style={css}>
      <Formik
        initialValues={{
          title: data.title,
          description: data.description,
          maxPlayers: data.maxPlayers,
          bounty: data.bounty,
          collateral: data.collateral,
          tags: data.tags,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 400);
          await saveQuest(values);
          onSave(values);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <FormStyled onSubmit={handleSubmit} ref={formRef}>
            <Split
              primary={
                <Spacer16>
                  <Spacer8V className="block">
                    <Split
                      primary={
                        <TextFieldInput
                          id="title"
                          label={isEdit ? 'Title' : ''}
                          isEdit={isEdit}
                          isLoading={isLoading}
                          placeHolder="Quest title"
                          value={values.title}
                          onChange={handleChange}
                          fontSize="24px"
                          wide
                        />
                      }
                      secondary={
                        !isEdit &&
                        (isLoading ? (
                          <Skeleton />
                        ) : (
                          <AddressField id="address" address={address} autofocus={false} />
                        ))
                      }
                    />
                  </Spacer8V>
                  <Spacer8V>
                    <TextFieldInput
                      id="description"
                      label={isEdit ? 'Description' : ''}
                      value={values.description}
                      isEdit={isEdit}
                      isLoading={isLoading}
                      placeHolder="Quest description"
                      onChange={handleChange}
                      wide
                      multiline
                      css={{ height: '100px' }}
                    />
                  </Spacer8V>
                </Spacer16>
              }
              secondary={
                <Spacer16>
                  {!isEdit && (
                    <>
                      <Field label="Status">{isLoading ? <Skeleton /> : status.label}</Field>
                      <Field label="Number of players">{isLoading ? <Skeleton /> : players}</Field>
                    </>
                  )}
                  {(values.maxPlayers !== -1 || isEdit) && (
                    <NumberFieldInput
                      id="maxPlayers"
                      onChange={handleChange}
                      isEdit={isEdit}
                      isLoading={isLoading}
                      label="Max players"
                      value={values.maxPlayers}
                      wide
                    />
                  )}
                  <AmountFieldInput
                    id="bounty"
                    label="Bounty"
                    isEdit={isEdit}
                    value={values.bounty}
                    isLoading={isLoading}
                    formik={formRef}
                  />
                  <AmountFieldInput
                    id="collateral"
                    label="Collateral amount"
                    isEdit={isEdit}
                    value={values.collateral}
                    isLoading={isLoading}
                    formik={formRef}
                  />
                  <TagFieldInput
                    id="tags"
                    label="Tags"
                    isEdit={isEdit}
                    isLoading={isLoading}
                    value={values.tags}
                    onChange={(e) => console.log(e)}
                    formik={formRef}
                  />
                </Spacer16>
              }
            />
            <QuestFooterStyled>
              {isEdit ? (
                <QuestActionButtonStyled
                  label="Save"
                  icon={<FaSave />}
                  mode="positive"
                  type="submit"
                />
              ) : (
                <>
                  <QuestActionButtonStyled label="Play" icon={<FaPlay />} mode="strong" />
                  <QuestActionButtonStyled label="Fund" icon={<FaDollarSign />} mode="strong" />
                </>
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
  data: PropTypes.shape({
    bounty: PropTypes.shape({
      amount: PropTypes.number,
      token: PropTypes.shape({
        address: PropTypes.string,
        name: PropTypes.string,
        symb: PropTypes.string,
      }),
    }),
    collateral: PropTypes.shape({
      amount: PropTypes.number,
      token: PropTypes.shape({
        address: PropTypes.string,
        name: PropTypes.string,
        symb: PropTypes.string,
      }),
    }),
    description: PropTypes.string,
    maxPlayers: PropTypes.number,
    tags: PropTypes.array,
    title: PropTypes.string,
  }),
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  onSave: PropTypes.func,
  players: PropTypes.number,
  status: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  }),
};
