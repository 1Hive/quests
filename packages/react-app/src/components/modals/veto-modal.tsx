/* eslint-disable no-nested-ternary */
import { Button, useToast, IconTarget } from '@1hive/1hive-ui';
import { debounce, noop, uniqueId } from 'lodash-es';
import { useState, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Formik, Form, FormikErrors } from 'formik';
import { ClaimModel } from 'src/models/claim.model';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/style.util';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { TransactionModel } from 'src/models/transaction.model';
import { FaEdit, FaEye } from 'react-icons/fa';
import { VetoModel } from 'src/models/veto.model';
import { useWallet } from 'src/contexts/wallet.context';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { QuestModel } from 'src/models/quest.model';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import TextFieldInput from '../field-input/text-field-input';
import { Outset } from '../utils/spacer-util';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx(1)};
  width: fit-content;
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const LineStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonLinkStyled = styled(Button)`
  border: none;
  box-shadow: none;
  padding: 0;
  height: fit-content;
  color: ${({ theme }: any) => theme.contentSecondary};
  font-weight: bold;
  background: transparent;
  padding-top: 4px;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  questData: QuestModel;
  vetoData?: VetoModel;
  onClose?: ModalCallback;
};

const emptyVetoData = {} as VetoModel;

export default function VetoModal({
  claim,
  questData,
  vetoData = emptyVetoData,
  onClose = noop,
}: Props) {
  const toast = useToast();
  const [opened, setOpened] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [vetoDataState, setVetoDataState] = useState<VetoModel>(vetoData);
  const { setTransaction } = useTransactionContext();
  const formRef = useRef<HTMLFormElement>(null);
  const { walletAddress } = useWallet();
  const modalId = useMemo(() => uniqueId('form-modal'), []);
  const isMountedRef = useIsMountedRef();

  const debounceSave = useCallback(
    debounce((data: VetoModel) => setVetoDataState(data), 500),
    [],
  );

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const vetoTx = async (values: Partial<VetoModel>) => {
    if (isFormValid) {
      try {
        if (!claim.container) throw new Error('Container is not defined');
        let txPayload = {
          modalId,
          message: `Vetoing Quest (1/1)`,
          status: TransactionStatus.WaitingForSignature,
          type: 'ClaimVeto',
          args: { questAddress: claim.questAddress, containerId: claim.container.id },
        } as TransactionModel;
        setTransaction(txPayload);
        const vetoTxReceipt = await QuestService.vetoQuestClaim(
          walletAddress,
          questData,
          {
            reason: values.reason!,
          },
          claim.container,
          (txHash) => {
            txPayload = { ...txPayload, hash: txHash };
            setTransaction({
              ...txPayload,
              status: TransactionStatus.Pending,
            });
          },
        );
        setTransaction({
          ...txPayload,
          status: vetoTxReceipt?.status ? TransactionStatus.Confirmed : TransactionStatus.Failed,
        });
        if (!vetoTxReceipt?.status) throw new Error('Failed to veto the quest claim');
        if (isMountedRef.current) {
          setVetoDataState(emptyVetoData);
        }
      } catch (e: any) {
        setTransaction(
          (oldTx) =>
            oldTx && {
              ...oldTx,
              message: computeTransactionErrorMessage(e),
              status: TransactionStatus.Failed,
            },
        );
        toast(computeTransactionErrorMessage(e));
      }
    }
  };

  const validate = (values: VetoModel) => {
    const errors = {} as FormikErrors<VetoModel>;
    if (!values.reason) errors.reason = 'Veto reason is required';
    debounceSave(values);
    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  return (
    <ModalBase
      id={modalId}
      title="Veto quest claim"
      openButton={
        <OpenButtonWrapperStyled>
          <OpenButtonStyled
            icon={<IconTarget />}
            onClick={() => setOpened(true)}
            label="Veto"
            mode="negative"
            title={"Open veto for this quest's claim"}
          />
        </OpenButtonWrapperStyled>
      }
      buttons={[
        <Button
          key="confirmButton"
          icon={<IconTarget />}
          label="Veto"
          mode="negative"
          type="submit"
          form="form-veto"
          disabled={!isFormValid}
          title={!isFormValid ? 'Form not valid' : 'Veto the quest claim'}
          className="m-8"
        />,
      ]}
      onClose={closeModal}
      isOpen={opened}
    >
      <Formik
        initialValues={{ reason: vetoDataState.reason ?? '' } as any}
        onSubmit={(values) => {
          validate(values); // validate one last time before submiting
          if (isFormValid) {
            vetoTx({
              reason: values.reason,
            });
          }
        }}
        validateOnChange
        validate={validate}
      >
        {({ values, handleSubmit, handleChange, errors, touched, handleBlur }) => (
          <FormStyled id="form-veto" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <TextFieldInput
                id="reason"
                isEdit={!showPreview}
                label={
                  <LineStyled>
                    Veto reason
                    <Outset horizontal>
                      <ButtonLinkStyled
                        size="mini"
                        icon={showPreview ? <FaEdit /> : <FaEye />}
                        display="icon"
                        label={showPreview ? 'Edit' : 'Preview'}
                        onClick={() => setShowPreview((old) => !old)}
                        title={
                          showPreview ? 'Back to edit mode' : 'Show a preview of the veto reason'
                        }
                      />
                    </Outset>
                  </LineStyled>
                }
                tooltip="Reason why this claim should be vetoed."
                value={values.reason}
                onChange={handleChange}
                multiline
                error={touched.reason && errors.reason}
                onBlur={handleBlur}
                wide
                isMarkDown
              />
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
