import { Button, GU, IconPlus } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { QUEST_MODE } from 'src/constants';
import { QuestData } from 'src/models/quest-data';
import styled from 'styled-components';
import Quest from '../shared/quest';
import ModalBase from './modal-base';

// #region StyledComponents

const QuestActionButtonStyled = styled(Button)`
  margin: ${1 * GU}px;
`;

// #endregion

type Props = {
  data?: QuestData;
  onClose?: Function;
  questMode: string;
};

export default function QuestModal({
  data = undefined,
  onClose = noop,
  questMode = QUEST_MODE.READ_SUMMARY,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('');
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
        setButtonLabel('Create quest');
        break;

      case QUEST_MODE.UPDATE:
        setButtonLabel('Update quest');
        break;

      case QUEST_MODE.READ_DETAIL:
        setButtonLabel('Details');
        break;

      default:
        break;
    }
  }, [questMode]);

  return (
    <ModalBase
      openButton={
        <Button
          icon={<IconPlus />}
          label={buttonLabel}
          wide
          mode="strong"
          onClick={onOpenButtonClick}
        />
      }
      buttons={
        (questMode === QUEST_MODE.CREATE || questMode === QUEST_MODE.UPDATE) && (
          <QuestActionButtonStyled
            label="Save"
            icon={<FaSave />}
            mode="positive"
            type="submit"
            form="quest-form-new"
          />
        )
      }
      isOpen={opened}
      onClose={onModalClose}
    >
      <Quest questMode={questMode} data={data} onSave={onSaveClick} />
    </ModalBase>
  );
}
