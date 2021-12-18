import { Button, useToast } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { DEFAULT_AMOUNT } from 'src/constants';
import { useERC20Contract } from 'src/hooks/use-contract.hook';
import { TokenAmount } from 'src/models/token-amount';
import { useWallet } from 'src/providers/wallet.context';
import * as QuestService from '../../services/quest.service';
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
  const contractERC20 = useERC20Contract(fundAmount?.token ?? DEFAULT_AMOUNT.token);
  const wallet = useWallet();
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };
  const onFundClick = () => {
    console.log('clicked fund quest');
    if (fundAmount && questAddress) {
      QuestService.fundQuest(wallet.account, questAddress, fundAmount, contractERC20).then(() => {
        onModalClose();
        toast('Transaction sent');
        console.log('clicked fund quest 2222');
      });
    }
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
