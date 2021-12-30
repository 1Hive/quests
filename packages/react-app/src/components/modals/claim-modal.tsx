/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, useToast } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useRef } from 'react';
import { GiBroadsword } from 'react-icons/gi';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { Formik, Form } from 'formik';
import { DEFAULT_AMOUNT } from 'src/constants';
import { Logger } from 'src/utils/logger';
import { TokenAmountModel } from 'src/models/token-amount.model';
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

// #endregion

type Props = {
  questAddress: string;
  claimDeposit?: TokenAmountModel;
  onClose?: Function;
};

export default function ClaimModal({ questAddress, claimDeposit, onClose = noop }: Props) {
  const toast = useToast();
  const wallet = useWallet();
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
      title="Claim quest"
      openButton={
        <Button
          icon={<GiBroadsword />}
          onClick={() => setOpened(true)}
          label="Claim"
          mode="positive"
        />
      }
      buttons={[
        <AmountFieldInputFormik
          id="claimDeposit"
          label="Claim Deposit"
          isEdit={false}
          tooltip="Claim deposit"
          tooltipDetail="This amount will be staked when claiming a bounty. If the claim is successfully challenged, you will lose this deposit."
          isLoading={loading}
          value={claimDeposit}
          compact
        />,
        <Button
          key="confirmButton"
          icon={<GiBroadsword />}
          label="Claim"
          mode="positive"
          type="submit"
          form="form-claim"
        />,
      ]}
      onClose={onModalClose}
      isOpen={opened}
    >
      <Formik
        initialValues={{ evidence: '', claimedAmount: DEFAULT_AMOUNT }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.claimedAmount?.amount) errors.push('Claimed amount is required');
          if (!values.evidence) errors.push('Evidence of completion is required');
          if (errors.length) {
            errors.forEach(toast);
          } else {
            setTimeout(async () => {
              try {
                setLoading(true);
                // toast('Quest claiming ...');
                toast('Comming soon ...');
                await QuestService.scheduleQuestClaim(governQueueContract, {
                  claimAmount: values.claimedAmount,
                  evidence: values.evidence,
                  playerAddress: wallet.account,
                  questAddress,
                });
                onModalClose();
                // toast('Operation succeed');
              } catch (e: any) {
                Logger.error(e);
                toast(
                  e.message.includes('\n') || e.message.length > 50
                    ? 'Oops. Something went wrong.'
                    : e.message,
                );
              } finally {
                setSubmitting(false);
                setLoading(false);
              }
            }, 0);
          }
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <FormStyled id="form-claim" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <TextFieldInput
                id="evidence"
                isEdit
                label="Evidence of completion"
                tooltip="Evidence of completion"
                tooltipDetail="The necessary evidence that will confirm the completion of the quest. Make sure there is enough evidence as it will be useful if this claim is challenged in the future."
                isLoading={loading}
                value={values.evidence}
                onChange={handleChange}
                multiline
                wide
                css={{ height: 100 }}
              />
              <AmountFieldInputFormik
                id="claimedAmount"
                isEdit
                tooltip="Claimed  amount"
                tooltipDetail="The expected amount to claim considering the agreement."
                label="Claimed amount"
                isLoading={loading}
                value={values.claimedAmount}
              />
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
