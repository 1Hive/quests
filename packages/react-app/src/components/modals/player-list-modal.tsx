/* eslint-disable no-nested-ternary */
import { Button, IconPlus, IconCross, IconGroup } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useMemo, useState } from 'react';

import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
// import * as QuestService from '../../services/quest.service';
import { AddressFieldInput } from '../field-input/address-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx(1)};
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
  playerList: string[] | undefined;
  isEdit: boolean;
  onClose?: ModalCallback;
};

export default function PlayerListModal({ playerList, isEdit, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [players, setPlayers] = useState<string[]>(playerList ?? ['']);
  const modalId = useMemo(() => uniqueId('whitelist-modal'), []);

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
              label="View Player List"
              mode="strong"
              title="Player List"
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
            </AddWrapperStyled>
          )}
        </Outset>
      </ModalBase>
    </>
  );
}
