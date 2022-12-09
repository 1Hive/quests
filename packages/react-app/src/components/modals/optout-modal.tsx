/* eslint-disable no-nested-ternary */
import { Button } from '@1hive/1hive-ui';
import { Form, Formik } from 'formik';
import { noop, uniqueId } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GiCrossedSwords } from 'react-icons/gi';
import styled from 'styled-components';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/style.util';
import { QuestModel } from 'src/models/quest.model';
import { useWallet } from 'src/contexts/wallet.context';
import { FormErrors } from 'src/models/form-errors';
import { PlayModel } from 'src/models/play.model';
import { TransactionModel } from 'src/models/transaction.model';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { toChecksumAddress } from 'web3-utils';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getTokenInfo } from 'src/utils/contract.util';
import { toTokenAmountModel } from 'src/utils/data.utils';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import ModalBase, { ModalCallback } from './modal-base';
import { AddressFieldInput } from '../field-input/address-field-input';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';

const FormStyled = styled(Form)`
  width: 100%;
  padding: 32px 16px 0 32px;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx(1)};
  width: fit-content;
`;

const RowStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

type Props = {
  onClose?: ModalCallback;
  questData: QuestModel;
};

export default function OptoutModal({ questData, onClose = noop }: Props) {
  const { walletAddress } = useWallet();
  const [opened, setOpened] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { setTransaction } = useTransactionContext();
  const modalId = useMemo(() => uniqueId('unplay-modal'), []);
  const [deposit, setDeposit] = useState<TokenAmountModel>();
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (questData.playDeposit) {
      (async () => {
        const tokenInfo = await getTokenInfo(questData.playDeposit!.token);
        if (!tokenInfo) throw new Error(`Token not found: ${questData.playDeposit!.token}`);
        const tokenModel = toTokenAmountModel({
          ...tokenInfo,
          amount: questData.playDeposit!.amount.toString(),
        });
        if (isMountedRef.current) {
          setDeposit(tokenModel);
        }
      })();
    }
  }, [questData.playDeposit?.token]);

  const onModalClosed = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const unplayQuest = async (values: PlayModel) => {
    if (!deposit?.token || !questData.address)
      throw new Error("Deposit or quest's address not defined");

    try {
      let txPayload = {
        modalId,
        message: 'Opting out quest',
        status: TransactionStatus.WaitingForSignature,
        type: TransactionType.QuestUnplay,
        args: { questAddress: questData.address, player: values.player || walletAddress },
      } as TransactionModel;
      setTransaction(txPayload);
      const txReceipt = await QuestService.unplayQuest(
        walletAddress,
        questData,
        values,
        (txHash) => {
          txPayload = { ...txPayload, hash: txHash };
          setTransaction({
            ...txPayload,
            status: TransactionStatus.Pending,
          });
        },
      );
      if (isMountedRef.current) {
        setTransaction({
          ...txPayload,
          status: txReceipt?.status ? TransactionStatus.Confirmed : TransactionStatus.Failed,
        });
      }
      if (!txReceipt?.status) throw new Error('Failed to opting out quest');
    } catch (e: any) {
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: TransactionStatus.Failed,
            message: computeTransactionErrorMessage(e),
          },
      );
    }
  };

  const onSubmit = async (values: PlayModel) => {
    validate(values); // validate one last time before submiting
    if (isFormValid) {
      await unplayQuest(values);
    }
  };

  const validate = (values: PlayModel) => {
    const errors = {} as FormErrors<PlayModel>;

    try {
      if (values.player) {
        values.player = toChecksumAddress(values.player);
      }
      // If user unregister a different address than connected but is not the quest creator
      if (values.player !== walletAddress && questData.creatorAddress === values.player) {
        errors.player = 'Only the quest creator can unregister another player';
      } else if (!questData.players?.includes(values.player || walletAddress)) {
        errors.player = 'Player is not part of the quest players';
      }
    } catch (error) {
      errors.player = 'Player address is not valid';
    }

    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  return (
    <Formik initialValues={{ player: '' }} onSubmit={onSubmit} validate={validate}>
      {({ values, handleSubmit, handleChange, handleBlur, touched, errors }) => (
        <ModalBase
          id={modalId}
          title="Opt out quest"
          openButton={
            <OpenButtonStyled
              icon={<GiCrossedSwords />}
              className="open-unplay-button"
              onClick={() => setOpened(true)}
              label="Opt out"
              mode="negative"
            />
          }
          buttons={[
            <Button
              className="submit-unplay-button"
              key="buttonUnplay"
              icon={<GiCrossedSwords />}
              type="submit"
              form="unplay-form"
              label="Opt out"
              mode="negative"
              title={!isFormValid ? 'Form not valid' : 'Opt out quest'}
              disabled={!isFormValid}
            />,
          ]}
          onModalClosed={onModalClosed}
          isOpened={opened}
          size="small"
        >
          <FormStyled id="unplay-form" onSubmit={handleSubmit} ref={formRef}>
            <AddressFieldInput
              id="player"
              isEdit
              label="Player"
              tooltip="The address of the player to unregister (only creator can unregister another player than connected one)"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.player || walletAddress}
              error={touched.player && (errors.player as string)}
              wide
              disabled={walletAddress !== questData.creatorAddress}
            />
            {deposit && (
              <RowStyled>
                <AmountFieldInputFormik
                  id="bounty"
                  label="Deposit recover"
                  value={deposit}
                  tooltip="Will be transfer to the player's wallet"
                />
              </RowStyled>
            )}
          </FormStyled>
        </ModalBase>
      )}
    </Formik>
  );
}
