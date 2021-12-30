import { Button, useToast, IconCoin, Field } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { TRANSACTION_STATUS } from 'src/constants';
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
  const { pushTransaction, updateTransactionStatus } = useTransactionContext()!;
  const questContract = useQuestContract(questData.address, true);
  const toast = useToast();
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  useEffect(() => {
    if (questContract && !fallbackAddress) {
      questContract.fundsRecoveryAddress().then(setFallbackAddress);
      setLoading(false);
    }
  }, [questContract]);

  const reclaimFundTx = async () => {
    try {
      setLoading(true);
      const txReceiptReclaim = await QuestService.reclaimUnusedFunds(questContract, (tx) => {
        pushTransaction({
          hash: tx,
          estimatedEnd: Date.now() + 10 * 1000, // 10 sec
          pendingMessage: 'Reclaiming unused fund...',
          status: TRANSACTION_STATUS.Pending,
        });
        onModalClose();
      });
      updateTransactionStatus({
        hash: txReceiptReclaim.transactionHash,
        status: TRANSACTION_STATUS.Confirmed,
      });
      toast('Operation succeed');
    } catch (e: any) {
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
            disabled={!bounty.amount}
            title={bounty.amount ? 'Reclaim funds' : 'No more funds'}
            mode="strong"
          />
        }
        buttons={
          <Button onClick={reclaimFundTx} icon={<IconCoin />} label="Reclaim funds" mode="strong" />
        }
        onClose={onModalClose}
        isOpen={opened}
      >
        <Outset gu16>
          <AmountFieldInputFormik
            id="bounty"
            isEdit={false}
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
