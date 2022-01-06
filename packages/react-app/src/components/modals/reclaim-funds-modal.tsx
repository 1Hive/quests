import { Button, useToast, IconCoin, Field } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { ENUM_TRANSACTION_STATUS, ENUM } from 'src/constants';
import { useQuestContract } from 'src/hooks/use-contract.hook';
import { Logger } from 'src/utils/logger';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import styled from 'styled-components';
import { GUpx } from 'src/utils/css.util';
import Skeleton from 'react-loading-skeleton';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import { Outset } from '../shared/utils/spacer-util';
import ModalBase from './modal-base';
import IdentityBadge from '../shared/identity-badge';

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
`;

type Props = {
  questData: QuestModel;
  bounty: TokenAmountModel;
  onClose?: Function;
};

export default function ReclaimFundsModal({ questData, bounty, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fallbackAddress, setFallbackAddress] = useState<string | undefined>(
    questData.fallbackAddress,
  );
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;
  const questContract = useQuestContract(questData.address, true);
  const toast = useToast();
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  useEffect(() => {
    if (questContract.instance?.address && !fallbackAddress) {
      questContract.instance.fundsRecoveryAddress().then(setFallbackAddress);
      setLoading(false);
    }
  }, [questContract.instance?.address]);

  const reclaimFundTx = async () => {
    try {
      setLoading(true);
      const pendingMessage = 'Reclaiming unused fund...';
      toast(pendingMessage);
      const txReceipt = await QuestService.reclaimQuestUnusedFunds(questContract!, (tx) => {
        pushTransaction({
          hash: tx,
          estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestFundsReclaiming, // 10 sec
          pendingMessage,
          status: ENUM_TRANSACTION_STATUS.Pending,
        });
      });
      updateTransactionStatus({
        hash: txReceipt.transactionHash,
        status: txReceipt.status
          ? ENUM_TRANSACTION_STATUS.Confirmed
          : ENUM_TRANSACTION_STATUS.Failed,
      });
      onModalClose();
      if (txReceipt.status) toast('Operation succeed');
    } catch (e: any) {
      updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
      Logger.error(e);
      toast(
        e.message.includes('\n') || e.message.length > 50
          ? 'Oops. Something went wrong.'
          : e.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ModalBase
        title="Reclaim unused quest funds"
        openButton={
          <OpenButtonStyled
            onClick={() => setOpened(true)}
            icon={<IconCoin />}
            label="Reclaim funds"
            disabled={!bounty.parsedAmount}
            title={bounty.parsedAmount ? 'Reclaim funds' : 'No more funds'}
            mode="strong"
          />
        }
        buttons={
          <Button
            onClick={reclaimFundTx}
            icon={<IconCoin />}
            label="Reclaim funds"
            mode="strong"
            disabled={loading || !questContract}
          />
        }
        onClose={onModalClose}
        isOpen={opened}
      >
        <Outset gu16>
          <AmountFieldInputFormik
            id="bounty"
            label="Reclaimable funds"
            isLoading={loading}
            value={bounty}
            wide
          />
          <Field label="will be send to">
            {!loading && fallbackAddress ? (
              <IdentityBadge entity={fallbackAddress} badgeOnly />
            ) : (
              <Skeleton />
            )}
          </Field>
        </Outset>
      </ModalBase>
    </>
  );
}
