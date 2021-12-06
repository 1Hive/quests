import { Button, GU, IconPlus } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState } from 'react';
import { QuestData } from 'src/models/quest-data';
import styled from 'styled-components';
import Quest from '../shared/quest';
import FundModal from './fund-modal';
import ModalBase from './modal-base';
import PlayModal from './play-modal';

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
  create: boolean;
  isDetailedView?: boolean;
};

export default function QuestModal({
  data = undefined,
  onClose = noop,
  create = false,
  isDetailedView = false,
}: Props) {
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
      title={create ? 'Create quest' : 'Details view'}
      openButton={
        <Button
          icon={<IconPlus />}
          label={isDetailedView ? 'Details' : 'Create quest'}
          wide
          mode="strong"
          onClick={onOpenButtonClick}
        />
      }
      buttons={
        data && (
          <ButtonWrapperStyled>
            <FundModal questAddress={data.address} />
            <PlayModal questAddress={data.address} />
          </ButtonWrapperStyled>
        )
      }
      isOpen={opened}
      onClose={onModalClose}
    >
      {isDetailedView && data ? (
        <Quest
          isDetailedView
          title={data.title}
          description={data.description}
          bounty={data.bounty}
          collateralPercentage={data.collateralPercentage}
          tags={data.tags}
          address={data.address}
          expireTimeMs={data.expireTimeMs}
        />
      ) : (
        <Quest isEdit onSave={onSaveClick} />
      )}
    </ModalBase>
  );
}
