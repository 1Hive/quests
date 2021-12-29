/* eslint-disable react/no-array-index-key */
import { TransactionProgress, Button, IconNotifications, FloatIndicator } from '@1hive/1hive-ui';
import { getNetwork } from 'src/networks';
import { useEffect, useRef, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { TransactionModel } from 'src/models/transaction.model';
import styled from 'styled-components';
import { Outset } from './utils/spacer-util';
import { TRANSACTION_STATUS } from '../../constants';

const NotificationButtonStyled = styled(Button)`
  &::after {
    content: '${({ count }: any) => count}';
    display: -ms-inline-flexbox;
    display: inline-flex;
    ${({ count }: any) => (count === 0 ? 'display: none;' : '')}

    -webkit-box-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    min-width: 16px;
    width: 16px;
    height: 16px;
    border-radius: 16px;
    font-size: 10px;
    background: rgb(0, 210, 255);
    position: absolute;
    top: 3px;
    right: 3px;
  }
`;

export function TransactionProgressButton() {
  const { explorerBase } = getNetwork();
  const { newTransaction, updatedTransactionStatus } = useTransactionContext()!;
  const [txOpened, setTxOpened] = useState(false);
  const [txList, setTxList] = useState<TransactionModel[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [currentTx, setCurrentTx] = useState<TransactionModel>();
  const activityOpener = useRef<any>();

  const toggleTransactionPopup = () => {
    setTxOpened(!txOpened);
  };

  const nextTx = (tx: TransactionModel | undefined) => {
    if (!tx) return;
    setCurrentTx(tx);
  };

  useEffect(() => {
    if (!txList.find((x) => x.hash === newTransaction?.hash)) {
      if (newTransaction) {
        setTxList(
          txList.concat({
            status: TRANSACTION_STATUS.Pending,
            progress: 0,
            estimatedEnd: Date.now() + 15 * 1000, // In 15 seconds
            ...newTransaction,
          }),
        );
        if (newTransaction.status === TRANSACTION_STATUS.Pending) setTxOpened(true);

        if (!currentTx) nextTx(newTransaction);
      }
    }
    return () => clearInterval();
  }, [newTransaction]);

  useEffect(() => {
    if (updatedTransactionStatus && txList.find((x) => x.hash === updatedTransactionStatus.hash)) {
      if (updatedTransactionStatus.status === TRANSACTION_STATUS.Confirmed) {
        setTxList(txList.filter((x: TransactionModel) => x.hash !== updatedTransactionStatus.hash));
      }
      if (updatedTransactionStatus.hash === currentTx?.hash)
        nextTx(
          txList.find(
            (x: TransactionModel) =>
              x.hash !== updatedTransactionStatus.hash && x.status === TRANSACTION_STATUS.Pending,
          ),
        );
    }
  }, [updatedTransactionStatus]);

  useEffect(() => {
    const count = txList.filter((x) => x.status === TRANSACTION_STATUS.Pending).length;
    setNotifCount(count);
    if (count === 0) {
      setTxOpened(false);
      setCurrentTx(undefined);
    }
  }, [txList]);

  const onClose = () => {
    setTxOpened(false);
  };

  return (
    <Outset horizontal>
      <NotificationButtonStyled
        label={notifCount ? 'Show pending transaction' : 'No pending transactions'}
        display="icon"
        ref={activityOpener}
        icon={<IconNotifications />}
        onClick={toggleTransactionPopup}
        count={notifCount}
        disabled={!notifCount}
      />
      <div ref={activityOpener} />
      {currentTx && (
        <>
          <TransactionProgress
            transactionHashUrl={`${explorerBase}/${currentTx.hash}`}
            visible={txOpened}
            onClose={onClose}
            opener={activityOpener.current}
            endTime={new Date(currentTx.estimatedEnd ?? Date.now())}
          />
          <FloatIndicator>{currentTx.pendingMessage}</FloatIndicator>
        </>
      )}
    </Outset>
  );
}
