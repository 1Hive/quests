import { Button, IconCoin } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useEffect, useState } from 'react';
import { ENUM_TRANSACTION_STATUS, ENUM } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import Skeleton from 'react-loading-skeleton';
import { useWallet } from 'src/contexts/wallet.context';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { getTokenInfo } from 'src/utils/contract.util';
import { toTokenAmountModel } from 'src/utils/data.utils';
import { TokenModel } from 'src/models/token.model';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';
import IdentityBadge from '../identity-badge';
import { FieldInput } from '../field-input/field-input';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx(1)};
  width: fit-content;
`;

const RowStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// #endregion

type Props = {
  questData: QuestModel;
  bounty?: TokenAmountModel | null;
  isDepositReleased: boolean;
  onClose?: ModalCallback;
};

export default function ReclaimFundsModal({
  questData,
  bounty,
  onClose = noop,
  isDepositReleased,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setTransaction, transaction } = useTransactionContext();
  const { walletAddress } = useWallet();
  const [depositTokenAmount, setDepositTokenAmount] = useState<TokenAmountModel>();
  let isMounted = true;

  useEffect(() => {
    if (questData.deposit) {
      const depositAmount = questData.deposit;
      getTokenInfo(questData.deposit?.token).then((token) => {
        if (isMounted) {
          setDepositTokenAmount(
            toTokenAmountModel({
              ...token,
              amount: depositAmount.amount.toString(),
            } as TokenModel),
          );
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const reclaimFundTx = async () => {
    try {
      setLoading(true);
      setTransaction({
        id: uniqueId(),
        estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestFundsReclaiming,
        message: 'Reclaiming funds and deposit',
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
        type: 'QuestReclaimFunds',
        args: { questAddress: questData.address },
      });
      const txReceipt = await QuestService.reclaimQuestUnusedFunds(
        walletAddress,
        questData,
        (txHash) => {
          setTransaction(
            (oldTx) =>
              oldTx && {
                ...oldTx,
                hash: txHash,
                status: ENUM_TRANSACTION_STATUS.Pending,
              },
          );
        },
      );
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: txReceipt?.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          },
      );
      if (!txReceipt?.status) throw new Error('Failed to reclaim funds');
    } catch (e: any) {
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: ENUM_TRANSACTION_STATUS.Failed,
            message: computeTransactionErrorMessage(e),
          },
      );
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
        expectedTransactionType="QuestReclaimFunds"
        title="Reclaim funds and deposit"
        openButton={
          <OpenButtonStyled
            onClick={() => setOpened(true)}
            icon={<IconCoin />}
            label="Reclaim"
            mode="strong"
            title={transaction ? `Wait for completion of : ${transaction.message}` : 'Reclaim'}
            disabled={!!transaction}
          />
        }
        buttons={
          <Button
            onClick={reclaimFundTx}
            icon={<IconCoin />}
            label="Reclaim"
            mode="strong"
            disabled={loading || !walletAddress}
          />
        }
        onClose={closeModal}
        isOpen={opened}
      >
        <RowStyled>
          <Outset gu16>
            <AmountFieldInputFormik
              id="bounty"
              label="Reclaimable funds"
              isLoading={loading}
              value={bounty}
            />
          </Outset>
          <Outset gu16>
            <FieldInput label="will be send to">
              {!loading ? (
                <IdentityBadge entity={questData.fallbackAddress} badgeOnly />
              ) : (
                <Skeleton />
              )}
            </FieldInput>
          </Outset>
        </RowStyled>
        {depositTokenAmount && !isDepositReleased && (
          <RowStyled>
            <Outset gu16>
              <AmountFieldInputFormik
                id="bounty"
                label="Reclaimable deposit"
                isLoading={loading}
                value={depositTokenAmount}
              />
            </Outset>
            <Outset gu16>
              <FieldInput label="will be send to">
                {!loading && questData.creatorAddress ? (
                  <IdentityBadge entity={questData.creatorAddress} badgeOnly />
                ) : (
                  <Skeleton />
                )}
              </FieldInput>
            </Outset>
          </RowStyled>
        )}
      </ModalBase>
    </>
  );
}
