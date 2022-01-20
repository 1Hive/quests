import { Info } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { useWallet } from 'src/contexts/wallet.context';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { getBalanceOf } from 'src/services/quest.service';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import AmountFieldInput from './field-input/amount-field-input';

const InfoStyled = styled(Info)`
  padding: ${GUpx()};
`;

type Props = {
  tokens: (TokenModel | string | undefined)[];
};

export function ShowBalanceOf({ tokens }: Props) {
  const { walletAddress } = useWallet();
  const [tokenBalances, setTokenBalances] = useState<TokenAmountModel[]>([]);
  useEffect(() => {
    const fetchBalances = async (_tokens: (TokenModel | string | undefined)[]) => {
      setTokenBalances(
        (
          await Promise.all(
            _tokens.map(async (token) => token && getBalanceOf(token, walletAddress)),
          )
        ).filter((x) => !!x) as TokenAmountModel[],
      );
    };
    if (tokens?.length) {
      fetchBalances(tokens);
    }
  }, [tokens]);
  return (
    <InfoStyled>
      {tokenBalances.map((token) => (
        <AmountFieldInput
          id={`balance-${token.token.symbol}`}
          key={`balance-${token.token.token}`}
          compact
          label="Your balance"
          tooltip="Balance"
          tooltipDetail="Connected wallet's balance of the specified token"
          value={token}
          maxDecimals={4}
        />
      ))}
    </InfoStyled>
  );
}
