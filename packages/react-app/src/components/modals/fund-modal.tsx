import { Button, useToast } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop } from 'lodash-es';
import { useRef, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { DEFAULT_AMOUNT } from 'src/constants';
import styled from 'styled-components';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
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
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  return (
    <Formik
      initialValues={{ fundAmount: DEFAULT_AMOUNT }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(async () => {
          onModalClose();
          setLoading(true);
          if (values.fundAmount && questAddress)
            QuestService.fundQuest(questAddress, values.fundAmount, () =>
              toast('Transaction completed'),
            ).then(() => {
              onModalClose();
              toast('Transaction sent');
            });
          setSubmitting(false);
          setLoading(false);
        }, 400);
      }}
    >
      {({ values, handleSubmit }) => (
        <FormStyled id="form-fund" onSubmit={handleSubmit} ref={formRef}>
          <ModalBase
            title="Fund"
            openButton={
              <Button
                icon={<GiTwoCoins />}
                onClick={() => setOpened(true)}
                label="Fund"
                mode="strong"
              />
            }
            buttons={
              <Button
                icon={<GiTwoCoins />}
                type="submit"
                form="form-fund"
                label="Fund"
                mode="strong"
              />
            }
            onClose={onModalClose}
            isOpen={opened}
          >
            <AmountFieldInputFormik
              id="fundAmount"
              isEdit
              label="Amount"
              isLoading={loading}
              value={values.fundAmount}
            />
          </ModalBase>
        </FormStyled>
      )}
    </Formik>
  );
}
