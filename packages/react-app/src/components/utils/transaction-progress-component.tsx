/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';

import { ENUM_TRANSACTION_STATUS } from 'src/constants';
import { Outset } from './spacer-util';

export function TransactionProgressComponent() {
  const { transaction, setTransaction } = useTransactionContext();
  const [message, setMessage] = useState<string | undefined>();
  useEffect(() => {
    switch (transaction?.status) {
      case ENUM_TRANSACTION_STATUS.WaitingForSignature:
        setMessage('Waiting for your signature...');
        break;
      case ENUM_TRANSACTION_STATUS.Pending:
        setMessage('Transaction is pending...');
        break;
      case ENUM_TRANSACTION_STATUS.Confirmed:
        setMessage('Transaction is confirmed!');
        break;
      case ENUM_TRANSACTION_STATUS.Failed:
        setMessage('Transaction failed!');
        break;
      default:
    }
  }, [transaction]);

  return (
    <Outset horizontal>
      {/* {updatedTransactionStatus?.status
        ? updatedTransactionStatus.pendingMessage
        : transaction?.pendingMessage} */}
      {message}
      {/* {currentTxStatus && currentTxStatus} */}
    </Outset>
  );
}
