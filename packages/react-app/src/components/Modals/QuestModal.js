import { Button, IconPlus, Modal } from '@1hive/1hive-ui';
import React, { useState } from 'react';
import Quest from '../Shared/Quest/Quest';

export default function CreateQuestModal({ onClose }) {
  const [opened, setOpened] = useState(false);
  const open = () => setOpened(true);
  const close = (emit = false) => {
    setOpened(false);
    if (emit) onClose();
  };
  return (
    <>
      <Button icon={<IconPlus />} label="Create quest" wide mode="strong" onClick={open} />
      <Modal
        visible={opened}
        onClose={close}
        width={(viewport) => Math.min(viewport.width - 48, 1200)}
      >
        <Quest isEdit onSave={() => close(true)} />
      </Modal>
    </>
  );
}
