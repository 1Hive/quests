import { Button, IconPlus } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { ENUM_QUEST_MODE } from 'src/constants';
import { QuestModel } from 'src/models/quest.model';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import Quest from '../shared/quest';
import ModalBase from './modal-base';

// #region StyledComponents

const QuestActionButtonStyled = styled(Button)`
  margin: ${GUpx()};
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
  questMode = ENUM_QUEST_MODE.ReadSummary,
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
      case ENUM_QUEST_MODE.Create:
        setButtonLabel('Create quest');
        break;

      case ENUM_QUEST_MODE.Update:
        setButtonLabel('Update quest');
        break;

      case ENUM_QUEST_MODE.ReadDetail:
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
        (questMode === ENUM_QUEST_MODE.Create || questMode === ENUM_QUEST_MODE.Update) && (
          <QuestActionButtonStyled
            key="btn-save"
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
