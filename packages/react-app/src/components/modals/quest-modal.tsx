import { Button, GU, IconPlus } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { QUEST_MODE } from 'src/constants';
import { QuestModel } from 'src/models/quest.model';
import styled from 'styled-components';
import Quest from '../shared/quest';
import ModalBase from './modal-base';

// #region StyledComponents

const QuestActionButtonStyled = styled(Button)`
  margin: ${1 * GU}px;
`;

// #endregion

type Props = {
  data?: QuestModel;
  onClose?: Function;
  questMode: string;
};

export default function QuestModal({
  data = undefined,
  onClose = noop,
  questMode = QUEST_MODE.ReadSummary,
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
      case QUEST_MODE.Create:
        setButtonLabel('Create quest');
        break;

      case QUEST_MODE.Update:
        setButtonLabel('Update quest');
        break;

      case QUEST_MODE.ReadDetail:
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
      buttons={[
        (questMode === QUEST_MODE.Create || questMode === QUEST_MODE.Update) && (
          <QuestActionButtonStyled
            label="Save"
            icon={<FaSave />}
            mode="positive"
            type="submit"
            form={`form-quest-form-${data?.address ?? 'new'}`}
          />
        ),
      ]}
      isOpen={opened}
      onClose={onModalClose}
    >
      <Quest questMode={questMode} data={data} onSave={onSaveClick} />
    </ModalBase>
  );
}
