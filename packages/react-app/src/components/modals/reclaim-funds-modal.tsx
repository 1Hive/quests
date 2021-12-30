import { Button, useToast, IconCoin, Field } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState } from 'react';
import { TRANSACTION_STATUS } from 'src/constants';
import { useQuestContract } from 'src/hooks/use-contract.hook';
import { Logger } from 'src/utils/logger';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import { Outset } from '../shared/utils/spacer-util';
import ModalBase from './modal-base';
import IdentityBadge from '../shared/identity-badge';

type Props = {
  onClose?: Function;
  questData: QuestModel;
  bounty: TokenAmountModel;
};

export default function ReclaimFundsModal({ questData, bounty, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const { pushTransaction, updateTransactionStatus } = useTransactionContext()!;
  const questContract = useQuestContract(questData.address, true);
  const toast = useToast();
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const reclaimFundModalTx = async (values: any, setSubmitting: Function) => {
    try {
      setLoading(true);
      const txReceiptReclaim = await QuestService.reclaimUnusedFunds(questContract, (tx) => {
        pushTransaction({
          hash: tx,
          estimatedEnd: Date.now() + 10 * 1000, // 10 sec
          pendingMessage: 'Reclaiming unused fund...',
          status: TRANSACTION_STATUS.Pending,
        });
      });
      updateTransactionStatus({
        hash: txReceiptReclaim.transactionHash,
        status: TRANSACTION_STATUS.Confirmed,
      });
      toast('Funds reclaimed successfully');
    } catch (e: any) {
      Logger.error(e);
      toast(
        e.message.includes('\n') || e.message.length > 50
          ? 'Oops. Something went wrong.'
          : e.message,
      );
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <>
      <ModalBase
        title="Reclaim unused quest funds"
        openButton={
          <Button
            onClick={() => setOpened(true)}
            icon={<IconCoin />}
            label="Reclaim funds"
            wide
            disabled={!bounty.amount}
            title={bounty.amount ? 'Reclaim funds' : 'No more funds'}
            mode="strong"
          />
        }
        buttons={
          <Button
            onClick={reclaimFundModalTx}
            icon={<IconCoin />}
            label="Reclaim funds"
            wide
            mode="strong"
          />
        }
        onClose={onModalClose}
        isOpen={opened}
      >
        <Outset gu16>
          <Field label="Reclaim funds destination">
            <IdentityBadge entity={questData.fallbackAddress!} badgeOnly />
          </Field>
          <AmountFieldInputFormik
            id="bounty"
            isEdit={false}
            label="Reclaimable funds"
            isLoading={loading}
            value={bounty}
          />
        </Outset>
      </ModalBase>
    </>
  );
}
