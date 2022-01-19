import { Button, IconPlus } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { QuestModel } from 'src/models/quest.model';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import * as QuestService from 'src/services/quest.service';
import Quest from '../quest';
import ModalBase, { ModalCallback } from './modal-base';
import { useQuestsContext } from '../../contexts/quests.context';

// #region StyledComponents

const QuestActionButtonStyled = styled(Button)`
  margin: ${GUpx()};
`;

// #endregion

type Props = {
  data?: QuestModel;
  onClose?: ModalCallback;
  questMode: string;
};

export default function QuestModal({
  data = undefined,
  onClose = noop,
  questMode = ENUM_QUEST_VIEW_MODE.ReadSummary,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('');
  const { setNewQuest } = useQuestsContext();

  const onOpenButtonClick = () => {
    setOpened(true);
  };

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const fetchNewQuest = async (questAddress: string) => {
    setInterval(async () => {
      const newQuest = await QuestService.fetchQuest(questAddress);
      if (newQuest) {
        setNewQuest(newQuest);
        clearInterval();
      }
    }, 1000); // Pull each seconds until the new quest is fetched
    closeModal(true);
  };

  useEffect(() => {
    switch (questMode) {
      case ENUM_QUEST_VIEW_MODE.Create:
        setButtonLabel('Create quest');
        break;

      case ENUM_QUEST_VIEW_MODE.Update:
        setButtonLabel('Update quest');
        break;

      case ENUM_QUEST_VIEW_MODE.ReadDetail:
        setButtonLabel('Details');
        break;

      default:
        break;
    }
  }, [questMode]);

  return (
    <ModalBase
      title="Create quest"
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
        (questMode === ENUM_QUEST_VIEW_MODE.Create ||
          questMode === ENUM_QUEST_VIEW_MODE.Update) && (
          <QuestActionButtonStyled
            key="btn-save"
            label="Create"
            mode="positive"
            type="submit"
            form={`form-quest-form-${data?.address ?? 'new'}`}
          />
        ),
      ]}
      isOpen={opened}
      onClose={() => closeModal(false)}
    >
      <Quest questMode={questMode} data={data} onSave={(x) => fetchNewQuest(x)} />
    </ModalBase>
  );
}
