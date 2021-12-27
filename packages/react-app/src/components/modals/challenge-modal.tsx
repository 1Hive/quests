/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, useToast, IconFlag, Timer } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Logger } from 'src/utils/logger';
import { ClaimModel } from 'src/models/claim.model';
import ModalBase from './modal-base';
import { useGovernQueueContract } from '../../hooks/use-contract.hook';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import TextFieldInput from '../shared/field-input/text-field-input';
import { Outset } from '../shared/utils/spacer-util';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;

const TimerStyled = styled(Timer)`
  svg {
    color: white !important;
  }
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
  const [challengeTimeout, setChallengedTimeout] = useState(false);

  useEffect(() => {
    let handle: any;
    if (claim.executionTime)
      handle = setTimeout(() => {
        setChallengedTimeout(true);
      }, claim.executionTime - Date.now());
    return () => {
      if (handle) clearTimeout(handle);
    };
  }, [claim.executionTime]);

  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  return (
    <ModalBase
      title="Challenge quest"
      openButton={
        <Button
          icon={<IconFlag />}
          onClick={() => setOpened(true)}
          label={
            <>
              Challenge
              {claim.executionTime && <TimerStyled end={new Date(claim.executionTime)} />}
            </>
          }
          mode="negative"
          disabled={challengeTimeout}
        />
      }
      buttons={[
        <AmountFieldInputFormik
          key="challengeDeposit"
          id="challengeDeposit"
          label="Challenge Deposit"
          isEdit={false}
          isLoading={loading}
          value={claim.challengeDeposit}
          compact
        />,
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
          const errors = [];
          if (!values.reason) errors.push('Reason is required');
          if (errors.length) {
            errors.forEach(toast);
          } else {
            setTimeout(async () => {
              try {
                setLoading(true);
                // toast('Quest claim challenging ...');
                toast('Comming soon ...');
                await QuestService.challengeQuestClaim(governQueueContract, {
                  claim,
                  reason: values.reason,
                  deposit: claim.challengeDeposit!,
                });
                onModalClose();
                // toast('Operation succeed');
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
            }, 400);
          }
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <FormStyled id="form-challenge" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
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
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
