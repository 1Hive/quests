import { Button, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useRef, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { DEFAULT_AMOUNT } from 'src/constants';
import { useERC20Contract } from 'src/hooks/use-contract.hook';
import { getNetwork } from 'src/networks';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import { Outset } from '../shared/utils/spacer-util';
import ModalBase from './modal-base';

type Props = {
  onClose?: Function;
  questAddress: string;
};

const FormStyled = styled(Form)`
  width: 100%;
`;

export default function FundModal({ questAddress, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();
  const { defaultToken } = getNetwork();
  const contractERC20 = useERC20Contract(defaultToken);
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  return (
    <ModalBase
      title="Fund quest"
      openButton={
        <Button icon={<GiTwoCoins />} onClick={() => setOpened(true)} label="Fund" mode="strong" />
      }
      buttons={
        <Button icon={<GiTwoCoins />} type="submit" form="form-fund" label="Fund" mode="strong" />
      }
      onClose={onModalClose}
      isOpen={opened}
    >
      <Formik
        initialValues={{ fundAmount: DEFAULT_AMOUNT }}
        onSubmit={(values, { setSubmitting }) => {
          const errors = [];
          if (!values.fundAmount?.amount) errors.push('Amount is required...');
          if (errors.length) {
            errors.forEach(toast);
          } else {
            setTimeout(async () => {
              try {
                setLoading(true);
                toast('Quest funding ...');
                await QuestService.fundQuest(contractERC20, questAddress, values.fundAmount);
                onModalClose();
                toast('Operation succeed');
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
          <FormStyled id="form-fund" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <AmountFieldInputFormik
                id="fundAmount"
                isEdit
                label="Amount"
                onChange={handleChange}
                isLoading={loading}
                value={values.fundAmount}
              />
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
