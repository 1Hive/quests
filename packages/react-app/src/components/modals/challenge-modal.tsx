/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, useToast, IconFlag, Timer } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Logger } from 'src/utils/logger';
import { ClaimModel } from 'src/models/claim.model';
import { CLAIM_STATUS, ENUM, TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ChallengeModel } from 'src/models/challenge.model';
import { GUpx } from 'src/utils/css.util';
import ModalBase from './modal-base';
import { useERC20Contract, useGovernQueueContract } from '../../hooks/use-contract.hook';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import TextFieldInput from '../shared/field-input/text-field-input';
import { Outset } from '../shared/utils/spacer-util';
import { HelpIcon } from '../shared/field-input/icon-tooltip';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx()};
`;

const HeaderStyled = styled.div`
  width: 18%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  challengerAddress: string;
  onClose?: Function;
};

export default function ChallengeModal({ claim, challengerAddress, onClose = noop }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;
  const formRef = useRef<HTMLFormElement>(null);
  const governQueueContract = useGovernQueueContract();
  const erc20Contract = useERC20Contract(claim.challengeDeposit!.token!);
  const [challengeTimeout, setChallengedTimeout] = useState(false);
  const [openButtonLabel, setOpenButtonLabel] = useState<string>();

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

  useEffect(() => {
    if (claim?.state === CLAIM_STATUS.Challenged) setOpenButtonLabel('Already challenged');
    else if (challengeTimeout) setOpenButtonLabel('No more challengable');
    else setOpenButtonLabel('Challenge');
  }, [claim.state, challengeTimeout]);

  const challengeTx = async (values: Partial<ChallengeModel>, setSubmitting: Function) => {
    try {
      setLoading(true);
      // toast('Quest claim challenging ...');
      toast('Comming soon...');
      const container = await QuestService.computeContainer(claim);
      const approveTxReceipt = await QuestService.approveTokenAmount(
        erc20Contract,
        challengerAddress,
        container.config.scheduleDeposit,
        (tx) => {
          pushTransaction({
            hash: tx,
            estimatedEnd: Date.now() + ENUM.ESTIMATED_TX_TIME_MS.TokenAproval,
            pendingMessage: 'Challenge deposit approval...',
          });
        },
      );
      updateTransactionStatus({
        hash: approveTxReceipt.transactionHash!,
        status: approveTxReceipt.status ? TRANSACTION_STATUS.Confirmed : TRANSACTION_STATUS.Failed,
      });
      const challengeTxReceipt = await QuestService.challengeQuestClaim(
        governQueueContract,
        container,
        {
          claim,
          reason: values.reason,
          deposit: claim.challengeDeposit!,
        },
        (tx) => {
          pushTransaction({
            hash: tx,
            estimatedEnd: Date.now() + ENUM.ESTIMATED_TX_TIME_MS.ClaimChallenging,
            pendingMessage: 'Quest challenging...',
          });
        },
      );
      updateTransactionStatus({
        hash: challengeTxReceipt.transactionHash!,
        status: challengeTxReceipt.status
          ? TRANSACTION_STATUS.Confirmed
          : TRANSACTION_STATUS.Failed,
      });
      onModalClose();
      if (challengeTxReceipt.status) if (challengeTxReceipt.status) toast('Operation succeed');
    } catch (e: any) {
      updateLastTransactionStatus(TRANSACTION_STATUS.Failed);
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
  };

  return (
    <ModalBase
      title={
        <HeaderStyled>
          <h1>Challenge quest</h1>{' '}
          <HelpIcon
            tooltip="What is a challenge?"
            tooltipDetail="A challenge allows you to deny a claim. It will be raised to Celeste and conviction voting will be used to determine the validity of this challenge."
          />
        </HeaderStyled>
      }
      openButton={
        <OpenButtonWrapperStyled>
          {openButtonLabel && (
            <OpenButtonStyled
              icon={<IconFlag />}
              onClick={() => setOpened(true)}
              label={openButtonLabel}
              mode="negative"
              disabled={
                challengeTimeout ||
                claim.state === CLAIM_STATUS.Challenged ||
                !erc20Contract ||
                !governQueueContract
              }
            />
          )}
          {!challengeTimeout && claim.executionTime && (
            <Timer end={new Date(claim.executionTime)} />
          )}
        </OpenButtonWrapperStyled>
      }
      buttons={[
        <AmountFieldInputFormik
          key="challengeDeposit"
          id="challengeDeposit"
          label="Challenge Deposit"
          tooltip="Amount"
          tooltipDetail="This amount will be staked when challenging this claim. If this challenge is denied, you will lose this deposit."
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
          disabled={loading}
        />,
      ]}
      onClose={onModalClose}
      isOpen={opened}
    >
      <Formik
        initialValues={{ reason: '' }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.reason) errors.push('Validation : Reason is required');
          if (errors.length) {
            errors.forEach(toast);
          } else {
            challengeTx(values, setSubmitting);
          }
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <FormStyled id="form-challenge" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <TextFieldInput
                id="reason"
                isEdit
                label="Challenge reason"
                tooltip="Challenge reason"
                tooltipDetail="Reason why this claim should be challenged."
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
