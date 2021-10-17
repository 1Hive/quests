import { Button, useToast } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { TokenAmount } from 'src/models/amount';
import * as QuestService from '../../services/QuestService';
import AmountFieldInput from '../shared/field-input/amount-field-input';
import ModalBase from './modal-base';

type Props = {
  onClose?: Function;
  questAddress: string;
};

export default function FundModal({ questAddress, onClose = noop }: Props) {
  const [fundAmount, setFundAmount] = useState<TokenAmount>();
  const [opened, setOpened] = useState(false);
  const toast = useToast();
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };
  const onFundClick = () => {
    if (fundAmount)
      QuestService.fundQuest(questAddress, fundAmount, () => toast('Transaction completed')).then(
        () => {
          onModalClose();
          toast('Transaction sent');
        },
      );
  };

  return (
    <ModalBase
      title="Fund"
      openButton={
        <Button icon={<GiTwoCoins />} onClick={() => setOpened(true)} label="Fund" mode="strong" />
      }
      buttons={<Button icon={<GiTwoCoins />} onClick={onFundClick} label="Fund" mode="strong" />}
      onClose={onModalClose}
      isOpen={opened}
    >
      <AmountFieldInput
        id="fundAmount"
        isEdit
        label="Amount"
        value={fundAmount}
        onChange={setFundAmount}
      />
    </ModalBase>
  );
}
