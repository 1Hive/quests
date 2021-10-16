import { Button, IconPlus } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState } from 'react';
import Quest from '../shared/quest';
import ModalBase from './modal-base';

type Props = {
  onClose: Function;
  create: boolean;
};

export default function QuestModal({ onClose = noop, create = false }: Props) {
  const [opened, setOpened] = useState(false);
  const onOpenButtonClick = () => {
    setOpened(true);
  };

  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const onSaveClick = (address: string) => {
    setOpened(false);
    onClose(address);
  };

  return (
    <ModalBase
      title={create ? 'Create quest' : 'Edit quest'}
      openButton={
        <Button
          icon={<IconPlus />}
          label={create ? 'Create quest' : 'Edit quest'}
          wide
          mode="strong"
          onClick={onOpenButtonClick}
        />
      }
      isOpen={opened}
      onClose={onModalClose}
    >
      <Quest isEdit onSave={onSaveClick} />
    </ModalBase>
  );
}
