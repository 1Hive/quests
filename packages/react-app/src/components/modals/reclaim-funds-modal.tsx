import { Button, useToast, IconCoin, Field } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useEffect, useState } from 'react';
import { ENUM_TRANSACTION_STATUS, ENUM } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import styled from 'styled-components';
import { GUpx } from 'src/utils/css.util';
import Skeleton from 'react-loading-skeleton';
import { useWallet } from 'src/contexts/wallet.context';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';
import IdentityBadge from '../identity-badge';

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
  width: fit-content;
`;

type Props = {
  questData: QuestModel;
  bounty: TokenAmountModel;
  onClose?: ModalCallback;
};

export default function ReclaimFundsModal({ questData, bounty, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fallbackAddress, setFallbackAddress] = useState<string | undefined>(
    questData.fallbackAddress,
  );
  const { setTransaction } = useTransactionContext();

  const { walletAddress } = useWallet();
  const toast = useToast();

  useEffect(() => {
    if (!fallbackAddress && questData.address && walletAddress) {
      QuestService.getQuestRecoveryAddress(questData.address).then((x) => {
        setFallbackAddress(x ?? undefined);
      });
    }
  }, [walletAddress]);

  const reclaimFundTx = async () => {
    try {
      setLoading(true);
      const pendingMessage = 'Reclaiming unused fund...';
      toast(pendingMessage);
      const id = uniqueId();
      const txReceipt = await QuestService.reclaimQuestUnusedFunds(
        walletAddress,
        questData,
        (tx) => {
          setTransaction({
            id,
            hash: tx,
            estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestFundsReclaiming, // 10 sec
            pendingMessage,
            status: ENUM_TRANSACTION_STATUS.Pending,
          });
        },
      );
      if (txReceipt) {
        updateTransactionStatus({
          id,
          hash: txReceipt.transactionHash,
          status: txReceipt.status
            ? ENUM_TRANSACTION_STATUS.Confirmed
            : ENUM_TRANSACTION_STATUS.Failed,
        });
      } else {
        updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
      }
      closeModal(true);
      if (!txReceipt?.status) throw new Error('Failed to reclaim funds');
      toast('Operation succeed');
    } catch (e: any) {
      updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
      toast(computeTransactionErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  return (
    <>
      <ModalBase
        id="reclaim-funds-modal"
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
            disabled={loading || !walletAddress}
          />
        }
        onClose={() => closeModal(false)}
        isOpen={opened}
      >
        <Outset gu16>
          <AmountFieldInputFormik
            id="bounty"
            label="Reclaimable funds"
            isLoading={loading}
            value={bounty}
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
