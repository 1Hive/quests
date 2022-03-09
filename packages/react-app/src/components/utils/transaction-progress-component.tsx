/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ENUM_TRANSACTION_STATUS } from 'src/constants';
import styled from 'styled-components';
import { TransactionBadge } from '@1hive/1hive-ui';
import { getNetwork } from 'src/networks';
import QuestLogo from '../quest-logo';
import { Outset } from './spacer-util';

const DivStyled = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export function TransactionProgressComponent() {
  const network = getNetwork();
  const { transaction, setTransaction } = useTransactionContext();
  const [logoColor, setLogoColor] = useState('red');
  const [message, setMessage] = useState<string | undefined>();
  useEffect(() => {
    switch (transaction?.status) {
      case ENUM_TRANSACTION_STATUS.WaitingForSignature:
        setMessage('Waiting for your signature...');
        setLogoColor('white');
        break;
      case ENUM_TRANSACTION_STATUS.Pending:
        setMessage('Transaction is pending...');
        setLogoColor('yellow');
        break;
      case ENUM_TRANSACTION_STATUS.Confirmed:
        setMessage('Transaction is confirmed!');
        setLogoColor('green');
        break;
      case ENUM_TRANSACTION_STATUS.Failed:
        setMessage('Transaction failed!');
        setLogoColor('red');
        break;
      default:
    }
  }, [transaction]);

  return (
    <Outset horizontal>
      <DivStyled>
        {/* {updatedTransactionStatus?.status
        ? updatedTransactionStatus.pendingMessage
        : transaction?.pendingMessage} */}
        <QuestLogo color="#FFFFFF" />
        <div>{message}</div>
        {/* {currentTxStatus && currentTxStatus} */}

        {transaction?.hash && (
          <TransactionBadge
            transaction={transaction.hash}
            explorerProvider={network.explorerBase}
            networkType={network.type}
          />
        )}
      </DivStyled>
    </Outset>
  );
}
