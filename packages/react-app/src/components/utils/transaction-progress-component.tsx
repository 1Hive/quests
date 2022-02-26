/* eslint-disable react/no-array-index-key */
import { useEffect } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';

import styled from 'styled-components';
import { ENUM, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { Outset } from './spacer-util';

// type Props {

// }
export function TransactionProgressComponent() {
  const { transaction, setTransaction } = useTransactionContext();

  // const [currentTxStatus, setCurrentTransactionStatus] = useState(undefined);

  useEffect(() => {
    if (transaction) {
      console.log(transaction?.status);
      setTransaction({
        status: ENUM_TRANSACTION_STATUS.Pending,
        progress: 0,
        estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.Default,
        ...transaction,
      });
    }
  }, [transaction]);

  useEffect(() => {
    // if (updatedTransactionStatus && txList.find((x) => x.id === updatedTransactionStatus.id)) {
    //   if (transaction?.status !== ENUM_TRANSACTION_STATUS.Pending) {
    //     setTxList(txList.filter((x: TransactionModel) => x.id !== updatedTransactionStatus.id));
    //   }
    // }
    if (
      transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed ||
      transaction?.status === ENUM_TRANSACTION_STATUS.Failed
    ) {
      // setCurrentTransactionStatus(updatedTransactionStatus?.status);
      setTransaction(undefined);
    }
  }, [transaction]);

  return (
    <Outset horizontal>
      {/* {updatedTransactionStatus?.status
        ? updatedTransactionStatus.pendingMessage
        : transaction?.pendingMessage} */}
      {transaction?.pendingMessage}
      {/* {currentTxStatus && currentTxStatus} */}
    </Outset>
  );
}
