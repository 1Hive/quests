import { Button, IconPlus } from '@1hive/1hive-ui';
import PropTypes from 'prop-types';
import { noop } from 'lodash-es';
import React, { useState } from 'react';
import Quest from '../Shared/Quest';
import ModalBase from './ModalBase';

export default function QuestModal({ onClose = noop, create = false }) {
  const [opened, setOpened] = useState(false);
  const onOpenButtonClick = () => {
    setOpened(true);
  };
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };
  const onSaveClick = (address) => {
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

QuestModal.propTypes = {
  create: PropTypes.bool,
  onClose: PropTypes.func,
};
