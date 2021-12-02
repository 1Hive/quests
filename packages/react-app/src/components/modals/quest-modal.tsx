import { Button, IconPlus } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { QUEST_MODE } from 'src/constants';
import Quest from '../shared/quest';
import ModalBase from './modal-base';

type Props = {
  onClose: Function;
  questMode: string;
};

export default function QuestModal({ onClose = noop, questMode = QUEST_MODE.READ }: Props) {
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState('');
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
  useEffect(() => {
    switch (questMode) {
      case QUEST_MODE.CREATE:
        setTitle('Create quest');
        break;

      case QUEST_MODE.UPDATE:
        setTitle('Update quest');
        break;

      case QUEST_MODE.READ:
        setTitle('Quest');
        break;

      default:
        break;
    }
  }, [questMode]);

  return (
    <ModalBase
      title={title}
      openButton={
        <Button icon={<IconPlus />} label={title} wide mode="strong" onClick={onOpenButtonClick} />
      }
      isOpen={opened}
      onClose={onModalClose}
    >
      <Quest questMode={questMode} onSave={onSaveClick} />
    </ModalBase>
  );
}
