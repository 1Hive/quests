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
  askedTokenAmount: TokenAmountModel;
  // eslint-disable-next-line no-unused-vars
  setIsEnoughBalance?: (valid: boolean) => void;
};

export function WalletBallance({ askedTokenAmount, setIsEnoughBalance }: Props) {
  const { walletAddress } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<TokenAmountModel>();
  const [isEnoughBalance, _setIsEnoughBalance] = useState(true);

  useEffect(() => {
    const fetchBalances = async (_token: TokenModel) => {
      setTokenBalance((await getBalanceOf(_token, walletAddress)) ?? undefined);
    };
    if (askedTokenAmount?.token) {
      fetchBalances(askedTokenAmount.token);
    }
  }, [askedTokenAmount, walletAddress]);

  useEffect(() => {
    if (tokenBalance) {
      const isEnough = tokenBalance.parsedAmount >= askedTokenAmount.parsedAmount;
      _setIsEnoughBalance(isEnough);
      if (setIsEnoughBalance) setIsEnoughBalance(isEnough);
    }
  }, [askedTokenAmount, tokenBalance, setIsEnoughBalance]);

  return (
    <>
      {tokenBalance && (
        <InfoStyled mode={isEnoughBalance ? 'info' : 'warning'}>
          <AmountFieldInput
            id={`balance-${tokenBalance.token.symbol}`}
            key={`balance-${tokenBalance.token.token}`}
            compact
            label={isEnoughBalance ? 'Wallet balance' : 'Not enough'}
            tooltip="Balance"
            tooltipDetail="Connected wallet's balance of the specified token"
            value={tokenBalance}
          />
        </InfoStyled>
      )}
    </>
  );
}
