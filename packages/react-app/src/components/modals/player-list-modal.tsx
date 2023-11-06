import { Button, IconGroup, EmptyStateCard } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useMemo, useState } from 'react';

import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { setWhitelist } from 'src/services/quest.service';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { TransactionModel } from 'src/models/transaction.model';
import { QuestModel } from 'src/models/quest.model';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useWallet } from 'src/contexts/wallet.context';
import { toChecksumAddress } from 'web3-utils';
import ModalBase, { ModalCallback } from './modal-base';
import AddressListFieldInput from '../field-input/address-list-field-input';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx(1)};
  width: fit-content;

  &,
  span {
    color: #242424;
  }
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConfirmWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EmptyStateCardStyled = styled(EmptyStateCard)`
  width: 100%;
  border: none;
  div {
    font-size: 25px !important;
  }
`;

const AddressListFieldInputStyled = styled(AddressListFieldInput)`
  margin-bottom: ${GUpx(2)};
`;

// #endregion

type Props = {
  questData: QuestModel;
  isEdit: boolean;
  onClose?: ModalCallback;
  onSubmit?: Function;
};

export default function PlayerListModal({
  questData,
  isEdit,
  onClose = noop,
  onSubmit = noop,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [players, setPlayers] = useState<string[]>(questData.players ?? ['']);
  const modalId = useMemo(() => uniqueId('player-list-modal'), []);
  const { setTransaction } = useTransactionContext();
  const { walletAddress } = useWallet();
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState<boolean>();

  const onModalClosed = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const onWhitelistSubmit = async () => {
    const filteredPlayers = players.filter((p) => !!p && p !== '');
    validate(filteredPlayers);
    let whitelistTxPayload: TransactionModel = {
      modalId,
      message: `Updating the quest players...`,
      status: TransactionStatus.WaitingForSignature,
      type: TransactionType.QuestSetWhitelist,
    };
    setTransaction(whitelistTxPayload);
    const receipt = await setWhitelist(
      walletAddress,
      filteredPlayers,
      questData.address!,
      (txHash) => {
        whitelistTxPayload = { ...whitelistTxPayload, hash: txHash };
        setTransaction({
          ...whitelistTxPayload,
          status: TransactionStatus.Pending,
        });
      },
    );
    setTransaction({
      ...whitelistTxPayload,
      status: receipt?.status ? TransactionStatus.Confirmed : TransactionStatus.Failed,
      args: { questAddress: questData.address, players: filteredPlayers },
    });
    onSubmit();
  };

  const validate = (newList: string[]) => {
    setError(undefined);
    newList
      .filter((p) => !!p && p !== '')
      .forEach((player) => {
        try {
          toChecksumAddress(player);
        } catch {
          setError('One of the player address is not valid');
        }
      });
  };

  return (
    <>
      <ModalBase
        id={modalId}
        title="Player List"
        openButton={
          <OpenButtonWrapperStyled>
            <OpenButtonStyled
              onClick={() => setOpened(true)}
              icon={<IconGroup />}
              label={
                walletAddress === questData.creatorAddress && questData.isWhitelist
                  ? 'Edit Player List'
                  : 'View Player List'
              }
              mode="strong"
              title="View players"
            />
          </OpenButtonWrapperStyled>
        }
        onModalClosed={onModalClosed}
        isOpened={opened}
        size="small"
        buttons={
          isEdit && (
            <ConfirmWrapperStyled>
              <Button
                icon={<IconGroup />}
                label="Confirm list"
                mode="strong"
                onClick={() => onWhitelistSubmit()}
                disabled={touched && !!error}
                title={touched && !!error ? 'Invalid form' : 'Confirm list'}
              />
            </ConfirmWrapperStyled>
          )
        }
      >
        {isEdit || players.length ? (
          <AddressListFieldInputStyled
            label="Players"
            id="players"
            onChange={(newList: string[]) => {
              setPlayers(newList);
              validate(newList);
            }}
            onBlur={() => setTouched(true)}
            isEdit={isEdit}
            value={players}
            error={error}
            touched={touched}
          />
        ) : (
          <EmptyStateCardStyled
            text="No players"
            action={<Button onClick={() => setOpened(false)} label="Close" />}
          />
        )}
      </ModalBase>
    </>
  );
}
