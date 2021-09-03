import React from 'react';
import { Modal } from '@1hive/1hive-ui';
import { useWizard, WizardProvider } from '../../../providers/Wizard';

const noop = () => {};

function Wizard({ opened, close }) {
  const { resetData, step } = useWizard();
  return (
    <Modal
      visible={opened}
      onClose={step !== 2 ? close : noop}
      onClosed={step === 3 ? resetData : noop}
      closeButton={step !== 2}
    />
  );
}

export default (props) => (
  <WizardProvider>
    <Wizard opened={props.opened} close={props.close} />
  </WizardProvider>
);
