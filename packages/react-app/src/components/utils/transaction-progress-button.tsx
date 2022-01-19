/* eslint-disable react/no-array-index-key */
import { TransactionProgress, Button, IconNotifications, SyncIndicator } from '@1hive/1hive-ui';
import { getNetwork } from 'src/networks';
import { useEffect, useRef, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { TransactionModel } from 'src/models/transaction.model';
import styled from 'styled-components';
import { ENUM, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { Outset } from './spacer-util';

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
  const { newTransaction, updatedTransactionStatus } = useTransactionContext();
  const [txOpened, setTxOpened] = useState(false);
  const [txList, setTxList] = useState<TransactionModel[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [currentTx, setCurrentTx] = useState<TransactionModel>();
  const [slow, setSlow] = useState(false);
  const activityOpener = useRef<any>();

  const toggleTransactionPopup = () => {
    setTxOpened(!txOpened);
  };

  const nextTx = (tx: TransactionModel | undefined) => {
    setCurrentTx(tx);
    clearTimeout();
    setSlow(false);
    if (tx?.estimatedEnd) {
      setTimeout(() => {
        setSlow(true);
      }, tx.estimatedEnd - Date.now());
    }
  };

  useEffect(() => {
    if (!txList.find((x) => x.hash === newTransaction?.hash)) {
      if (newTransaction) {
        setTxList(
          txList.concat({
            status: ENUM_TRANSACTION_STATUS.Pending,
            progress: 0,
            estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.Default,
            ...newTransaction,
          }),
        );
        if (newTransaction.status === ENUM_TRANSACTION_STATUS.Pending) setTxOpened(true);

        if (!currentTx) nextTx(newTransaction);
      }
    }
    return () => clearInterval();
  }, [newTransaction]);

  useEffect(() => {
    if (updatedTransactionStatus && txList.find((x) => x.hash === updatedTransactionStatus.hash)) {
      if (updatedTransactionStatus.status !== ENUM_TRANSACTION_STATUS.Pending) {
        setTxList(txList.filter((x: TransactionModel) => x.hash !== updatedTransactionStatus.hash));
      }
      if (updatedTransactionStatus.hash === currentTx?.hash) {
        setSlow(false);
        nextTx(
          txList.find(
            (x: TransactionModel) =>
              x.hash !== updatedTransactionStatus.hash &&
              x.status === ENUM_TRANSACTION_STATUS.Pending,
          ),
        );
      }
    }
  }, [updatedTransactionStatus]);

  useEffect(() => {
    const count = txList.filter((x) => x.status === ENUM_TRANSACTION_STATUS.Pending).length;
    setNotifCount(count);
    if (count === 0) {
      setTxOpened(false);
      setCurrentTx(undefined);
    }
  }, [txList]);

  const onClose = () => {
    if (currentTx?.status !== ENUM_TRANSACTION_STATUS.Pending)
      nextTx(txList.find((x: TransactionModel) => x.status === ENUM_TRANSACTION_STATUS.Pending));
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
            slow={slow}
          />
          {currentTx.status === ENUM_TRANSACTION_STATUS.Pending && (
            <SyncIndicator>{currentTx.pendingMessage}</SyncIndicator>
          )}
        </>
      )}
    </Outset>
  );
}
