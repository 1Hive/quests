/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Checkbox, useToast } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState } from 'react';
import { GiBroadsword } from 'react-icons/gi';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import * as QuestService from '../../services/quest.service';
import ModalBase from './modal-base';

const FlexStyled = styled.div`
  display: flex;
`;

type Props = {
  questAddress: string;
  onClose?: Function;
  disabled?: boolean;
};

export default function ClaimModal({ questAddress, onClose = noop, disabled = false }: Props) {
  const toast = useToast();
  const wallet = useWallet();
  const [opened, setOpened] = useState(false);
  const [licenseChecked, setLicenseChecked] = useState(false);
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };
  const onClaimClick = () => {
    onModalClose();
    QuestService.claimQuest(questAddress, wallet.account).then(() => toast('Successfully claim'));
  };
  return (
    <ModalBase
      title="Claim"
      openButton={
        <Button
          icon={<GiBroadsword />}
          onClick={() => setOpened(true)}
          label="Claim"
          mode="positive"
          disabled={disabled}
        />
      }
      buttons={[
        <FlexStyled key="acceptLicense">
          <Checkbox id="license" checked={licenseChecked} onChange={setLicenseChecked} />
          <label htmlFor="license">I accept the terms</label>
        </FlexStyled>,
        <Button
          key="confirmButton"
          icon={<GiBroadsword />}
          onClick={onClaimClick}
          label="Claim"
          mode="positive"
          disabled={!licenseChecked}
        />,
      ]}
      onClose={onModalClose}
      isOpen={opened}
    >
      Put evidence of completion here
    </ModalBase>
  );
}
