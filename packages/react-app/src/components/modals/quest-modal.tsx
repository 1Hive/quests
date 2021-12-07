import { Button, GU, IconPlus } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { QUEST_MODE } from 'src/constants';
import { QuestData } from 'src/models/quest-data';
import styled from 'styled-components';
import Quest from '../shared/quest';
import ClaimModale from './claim-modal';
import FundModal from './fund-modal';
import ModalBase from './modal-base';

// #region StyledComponents

const ButtonWrapperStyled = styled.div`
  margin: ${1 * GU}px;
  margin-bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

type Props = {
  data?: QuestData;
  onClose: Function;
  questMode: string;
};

// #endregion

export default function QuestModal({
  data = undefined,
  onClose = noop,
  questMode = QUEST_MODE.READ_SUMMARY,
}: Props) {
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

      case QUEST_MODE.READ_DETAIL:
        setTitle('Detail');
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
      buttons={
        questMode === QUEST_MODE.READ_DETAIL &&
        data?.address && (
          <ButtonWrapperStyled>
            <FundModal questAddress={data.address} />
            <ClaimModale questAddress={data.address} />
          </ButtonWrapperStyled>
        )
      }
      isOpen={opened}
      onClose={onModalClose}
    >
      <Quest questMode={questMode} data={data} onSave={onSaveClick} />
    </ModalBase>
  );
}
