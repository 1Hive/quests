/* eslint-disable no-nested-ternary */
import { Button, Info } from '@1hive/1hive-ui';
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
import { approveTokenTransaction } from 'src/services/transaction-handler';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { QuestStatus } from 'src/enums/quest-status.enum';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';
import { AddressFieldInput } from '../field-input/address-field-input';
import { WalletBalance } from '../wallet-balance';
import * as QuestService from '../../services/quest.service';
import AmountFieldInput from '../field-input/amount-field-input';

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx(1)};
  width: fit-content;
`;

const DepositInfoStyled = styled(Info)`
  padding: ${GUpx(1)};
  margin-left: ${GUpx(2)};
`;

type Props = {
  onClose?: ModalCallback;
  questData: QuestModel;
};

export default function PlayModal({ questData, onClose = noop }: Props) {
  const { walletAddress } = useWallet();
  const [opened, setOpened] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { setTransaction } = useTransactionContext();
  const [isDepositEnoughBalance, setIsDepositEnoughBalance] = useState<boolean>(true);
  const modalId = useMemo(() => uniqueId('play-modal'), []);
  const [deposit, setDeposit] = useState<TokenAmountModel>();
  const isMountedRef = useIsMountedRef();

  const maxPlayerReached = useMemo(() => {
    if (!questData.players || !questData.maxPlayers) return false;
    return questData.players.length >= questData.maxPlayers;
  }, [questData.players?.length, questData.maxPlayers]);

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

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const playQuest = async (values: PlayModel) => {
    if (!deposit?.token || !questData.address)
      throw new Error("Deposit or quest's address not defined");

    await approveTokenTransaction(
      modalId,
      deposit.token,
      questData.address,
      `Approving play deposit (1/2)`,
      walletAddress,
      setTransaction,
    );

    try {
      let txPayload = {
        modalId,
        message: 'Playing quest (2/2)',
        status: TransactionStatus.WaitingForSignature,
        type: TransactionType.QuestPlay,
        args: { questAddress: questData.address, player: values.player || walletAddress },
      } as TransactionModel;
      if (!isMountedRef.current) return;
      setTransaction(txPayload);
      const txReceipt = await QuestService.playQuest(walletAddress, questData, values, (txHash) => {
        txPayload = { ...txPayload, hash: txHash };
        setTransaction({
          ...txPayload,
          status: TransactionStatus.Pending,
        });
      });
      if (isMountedRef.current) {
        setTransaction({
          ...txPayload,
          status: txReceipt?.status ? TransactionStatus.Confirmed : TransactionStatus.Failed,
        });
        if (!txReceipt?.status) throw new Error('Failed to play quest');
      }
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
      await playQuest(values);
    }
  };

  const validate = (values: PlayModel) => {
    const errors = {} as FormErrors<PlayModel>;

    try {
      if (values.player) {
        values.player = toChecksumAddress(values.player);
      }
      // If user register a different address than connected but is not the quest creator
      if (values.player !== walletAddress && questData.creatorAddress === values.player) {
        errors.player = 'Only the quest creator can register another player';
      } else if (questData.players?.includes(values.player || walletAddress)) {
        errors.player = 'Player is already playing this quest';
      }
    } catch (error) {
      errors.player = 'Player address is not valid';
    }

    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  return (
    <Formik initialValues={{ player: '' }} onSubmit={onSubmit} validateOnChange validate={validate}>
      {({ values, handleSubmit, handleChange, handleBlur, touched, errors }) => (
        <ModalBase
          id={modalId}
          title="Play quest"
          openButton={
            <OpenButtonStyled
              icon={<GiCrossedSwords />}
              className="open-play-button"
              onClick={() => setOpened(true)}
              label="Play"
              mode="positive"
            />
          }
          buttons={[
            deposit && (
              <WalletBalance
                key="playDeposit"
                askedTokenAmount={deposit}
                setIsEnoughBalance={setIsDepositEnoughBalance}
              />
            ),
            deposit && (
              <DepositInfoStyled
                mode={isDepositEnoughBalance ? 'info' : 'warning'}
                key="playDeposit"
              >
                <AmountFieldInput
                  id="playDeposit"
                  label="Play Deposit"
                  tooltip="This amount will be hold by the Quest. Just leave the quest to recover it."
                  value={deposit}
                  compact
                  showUsd
                />
              </DepositInfoStyled>
            ),
            <Button
              className="submit-play-button"
              key="buttonPlay"
              icon={<GiCrossedSwords />}
              type="submit"
              form="play-form"
              label="Play"
              mode="positive"
              title={
                questData.status !== QuestStatus.Active
                  ? 'Quest expired'
                  : maxPlayerReached
                  ? 'Max player reached'
                  : !isFormValid
                  ? 'Form not valid'
                  : 'Play quest'
              }
              disabled={
                questData.status !== QuestStatus.Active ||
                maxPlayerReached ||
                !isDepositEnoughBalance ||
                !isFormValid
              }
            />,
          ]}
          onClose={closeModal}
          isOpen={opened}
          size="small"
        >
          <FormStyled id="play-form" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu32 vertical>
              <AddressFieldInput
                id="player"
                isEdit
                label="Player"
                tooltip="The address of the player to register (only creator can register another player than connected one)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.player || walletAddress}
                error={touched.player && (errors.player as string)}
                wide
                disabled={walletAddress !== questData.creatorAddress}
              />
            </Outset>
          </FormStyled>
          {maxPlayerReached && (
            <Outset vertical>
              <Info mode="warning">❌ The maximum number of player has been reached</Info>
            </Outset>
          )}
          {questData.status !== QuestStatus.Active && (
            <Outset vertical>
              <Info mode="warning">
                ❌ This quest is expired and will no longer accept new players
              </Info>
            </Outset>
          )}
        </ModalBase>
      )}
    </Formik>
  );
}
