/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, useToast, IconFlag } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Logger } from 'src/utils/logger';
import { ClaimModel } from 'src/models/claim.model';
import ModalBase from './modal-base';
import { useGovernQueueContract } from '../../hooks/use-contract.hook';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import TextFieldInput from '../shared/field-input/text-field-input';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;
// #endregion

type Props = {
  claim: ClaimModel;
  onClose?: Function;
};

export default function ChallengeModal({ claim, onClose = noop }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const governQueueContract = useGovernQueueContract();
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  return (
    <ModalBase
      title="Challenge"
      openButton={
        <Button
          icon={<IconFlag />}
          onClick={() => setOpened(true)}
          label="Challenge"
          mode="negative"
        />
      }
      buttons={[
        <Button
          key="confirmButton"
          icon={<IconFlag />}
          label="Challenge"
          mode="negative"
          type="submit"
          form="form-challenge"
        />,
      ]}
      onClose={onModalClose}
      isOpen={opened}
    >
      <Formik
        initialValues={{ reason: '' }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            if (values.reason) {
              try {
                setLoading(true);
                toast('Quest claim challenging ...');
                await QuestService.challengeQuestClaim(governQueueContract, {
                  claim,
                  reason: values.reason,
                });
                onModalClose();
                toast('Operation succeed');
              } catch (e: any) {
                Logger.error(e);
                toast(
                  e.message.includes('\n') || e.message.length > 75
                    ? 'Oops. Something went wrong.'
                    : e.message,
                );
              } finally {
                setSubmitting(false);
                setLoading(false);
              }
            }
          }, 400);
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <FormStyled id="form-claim" onSubmit={handleSubmit} ref={formRef}>
            <TextFieldInput
              id="reason"
              isEdit
              label="Reason of challenge"
              isLoading={loading}
              value={values.reason}
              onChange={handleChange}
              multiline
              wide
              css={{ height: 100 }}
            />
            <AmountFieldInputFormik
              id="challengeDeposit"
              label="Challenge Deposit"
              isEdit={false}
              isLoading={loading}
              value={claim.challengeDeposit}
            />
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
