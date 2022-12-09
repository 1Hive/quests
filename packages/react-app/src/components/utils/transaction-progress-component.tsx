import { TransactionBadge, useTheme, textStyle } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { getNetwork } from 'src/networks';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import QuestLogo from '../../assets/quest-logo';
import { Outset } from './spacer-util';

const WrapperStyled = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const MessageStyled = styled.div<{ messageColor: string }>`
  color: ${({ messageColor }) => messageColor};
  margin-bottom: ${GUpx(1)};
`;

const TransactionTitleStyled = styled.div`
  margin: ${GUpx(1)};
  ${textStyle('title3')};
`;

export function TransactionProgressComponent() {
  const network = getNetwork();
  const { transaction } = useTransactionContext();
  const [message, setMessage] = useState<string | undefined>();
  const {
    warning,
    warningSurfaceContent,
    positive,
    positiveSurface,
    negative,
    negativeSurface,
    content,
  } = useTheme();
  const [logoColor, setLogoColor] = useState<string>(content);
  const [messageColor, setMessageColor] = useState<string>(content);
  useEffect(() => {
    switch (transaction?.status) {
      case TransactionStatus.WaitingForSignature:
        setMessage('Waiting for your signature');
        setLogoColor(content);
        setMessageColor(content);
        break;
      case TransactionStatus.Pending:
        setMessage('Transaction is pending');
        setLogoColor(warning);
        setMessageColor(warningSurfaceContent);
        break;
      case TransactionStatus.Confirmed:
        setMessage('Transaction is confirmed. You can close this window.');
        setLogoColor(positiveSurface);
        setMessageColor(positive);
        break;
      case TransactionStatus.Failed:
        setMessage('Transaction failed. Please try again in a few seconds.');
        setLogoColor(negativeSurface);
        setMessageColor(negative);
        break;
      default:
    }
  }, [transaction]);

  return (
    <Outset horizontal>
      <WrapperStyled>
        <QuestLogo animated={transaction?.status === TransactionStatus.Pending} color={logoColor} />
        <TransactionTitleStyled className={transaction?.status}>
          {transaction?.message}
        </TransactionTitleStyled>
        <MessageStyled messageColor={messageColor}>{message}</MessageStyled>
        {transaction?.hash && (
          <TransactionBadge
            transaction={transaction.hash}
            explorerProvider={network.explorer}
            networkType={network.networkId}
          />
        )}
      </WrapperStyled>
    </Outset>
  );
}
