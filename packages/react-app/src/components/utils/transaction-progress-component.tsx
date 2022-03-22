import { TransactionBadge, useTheme, textStyle } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ENUM_TRANSACTION_STATUS } from 'src/constants';
import styled from 'styled-components';
import { getNetwork } from 'src/networks';
import { GUpx } from 'src/utils/css.util';
import QuestLogo from '../quest-logo';
import { Outset } from './spacer-util';

const WrapperStyled = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const MessageStyled = styled.div`
  color: ${({ messageColor }: any) => messageColor};
  margin-bottom: ${GUpx()};
`;

const TransactionTitleStyled = styled.div`
  margin: ${GUpx()};
  ${textStyle('title3')};
`;

export function TransactionProgressComponent() {
  const network = getNetwork();
  const { transaction } = useTransactionContext();
  const [logoColor, setLogoColor] = useState<string>();
  const [messageColor, setMessageColor] = useState<string>();
  const [message, setMessage] = useState<string | undefined>();
  const { warning, warningSurface, positive, positiveSurface, negative, negativeSurface, content } =
    useTheme();
  useEffect(() => {
    switch (transaction?.status) {
      case ENUM_TRANSACTION_STATUS.WaitingForSignature:
        setMessage('Waiting for your signature...');
        setLogoColor(content);
        setMessageColor(content);
        break;
      case ENUM_TRANSACTION_STATUS.Pending:
        setMessage('Transaction is pending...');
        setLogoColor(warningSurface);
        setMessageColor(warning);
        break;
      case ENUM_TRANSACTION_STATUS.Confirmed:
        setMessage('Transaction is confirmed');
        setLogoColor(positiveSurface);
        setMessageColor(positive);
        break;
      case ENUM_TRANSACTION_STATUS.Failed:
        setMessage('Transaction failed');
        setLogoColor(negativeSurface);
        setMessageColor(negative);
        break;
      default:
    }
  }, [transaction]);

  return (
    <Outset horizontal>
      <WrapperStyled>
        <QuestLogo
          animated={transaction?.status === ENUM_TRANSACTION_STATUS.Pending}
          color={logoColor}
        />
        <TransactionTitleStyled>{transaction?.message}</TransactionTitleStyled>
        <MessageStyled messageColor={messageColor}>{message}</MessageStyled>
        {transaction?.hash && (
          <TransactionBadge
            transaction={transaction.hash}
            explorerProvider={network.explorerBase}
            networkType={network.type}
          />
        )}
      </WrapperStyled>
    </Outset>
  );
}
