/* eslint-disable no-nested-ternary */
import { Button, IconPlus, IconCross, IconGroup } from '@1hive/1hive-ui';
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
import { AddressFieldInput } from '../field-input/address-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';

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

const PlayerWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  max-width: 425px;
  Button {
    margin-bottom: ${GUpx(1)};
    min-height: 45px;
    border: none;
  }
`;

const AddWrapperStyled = styled.div`
  display: flex;
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
  const modalId = useMemo(() => uniqueId('whitelist-modal'), []);
  const { setTransaction } = useTransactionContext();
  const { walletAddress } = useWallet();

  const onModalClosed = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };
  //
  const onChange = (value: string, index: number) => {
    const newList = [...players];
    newList[index] = value;
    setPlayers(newList);
  };

  const addPlayerToWhitelist = () => {
    const newList = [...players];
    newList.push('');
    setPlayers(newList);
  };

  const removePlayerFromWhitelist = (index: number) => {
    const newList = [...players];
    newList.splice(index, 1);
    setPlayers(newList);
  };

  const onWhitelistSubmit = async () => {
    if (players.length) {
      let whitelistTxPayload: TransactionModel = {
        modalId,
        message: `Setting whitelisted players...`,
        status: TransactionStatus.WaitingForSignature,
        type: TransactionType.QuestSetWhitelist,
      };
      setTransaction(whitelistTxPayload);
      const receipt = await setWhitelist(walletAddress, players, questData.address!, (txHash) => {
        whitelistTxPayload = { ...whitelistTxPayload, hash: txHash };
        setTransaction({
          ...whitelistTxPayload,
          status: TransactionStatus.Pending,
        });
      });
      setTransaction({
        ...whitelistTxPayload,
        status: receipt?.status ? TransactionStatus.Confirmed : TransactionStatus.Failed,
        args: { questAddress: questData.address, players },
      });
      onSubmit();
    }
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
              title={!isEdit && !players.length ? 'No players' : 'View players'}
              disabled={!isEdit && !players.length}
            />
          </OpenButtonWrapperStyled>
        }
        onModalClosed={onModalClosed}
        isOpened={opened}
        size="small"
      >
        <Outset gu16>
          {players.map((player, i) => (
            <PlayerWrapperStyled>
              <AddressFieldInput
                id={`players[${i}]`}
                label={`Player #${i + 1}`}
                isEdit={isEdit}
                value={player}
                onChange={(e: any) => onChange(e.target.value, i)}
                wide
              />
              {isEdit && (
                <Button icon={<IconCross />} onClick={() => removePlayerFromWhitelist(i)} />
              )}
            </PlayerWrapperStyled>
          ))}

          {isEdit && (
            <AddWrapperStyled>
              <Button icon={<IconPlus />} label="Add" onClick={() => addPlayerToWhitelist()} />
              <Button
                icon={<IconPlus />}
                label="Confirm list"
                mode="strong"
                onClick={() => onWhitelistSubmit()}
              />
            </AddWrapperStyled>
          )}
        </Outset>
      </ModalBase>
    </>
  );
}
