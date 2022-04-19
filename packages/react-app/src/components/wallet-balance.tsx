import { useEffect, useState } from 'react';
import { useThemeContext } from 'src/contexts/theme.context';
import { useWallet } from 'src/contexts/wallet.context';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { getBalanceOf } from 'src/services/quest.service';
import { ThemeInterface } from 'src/styles/theme';
import styled, { css } from 'styled-components';
import AmountFieldInput from './field-input/amount-field-input';
import { FieldInput } from './field-input/field-input';

// #region StyledComponents

const WrapperStyled = styled.div<{ theme: ThemeInterface; isEnoughBalance: boolean }>`
  ${({ isEnoughBalance, theme }) =>
    !isEnoughBalance &&
    css`
      label {
        color: ${theme.negative};
      }
    `}
`;
// #endregion

type Props = {
  askedTokenAmount?: TokenAmountModel;
  setIsEnoughBalance?: (_valid: boolean) => void;
};

export function WalletBallance({ askedTokenAmount, setIsEnoughBalance }: Props) {
  const { walletAddress } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<TokenAmountModel>();
  const [isEnoughBalance, _setIsEnoughBalance] = useState(true);
  const { currentTheme } = useThemeContext();

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
      const isEnough =
        (askedTokenAmount && tokenBalance.parsedAmount >= askedTokenAmount.parsedAmount) ?? false;
      _setIsEnoughBalance(isEnough);
      if (setIsEnoughBalance) setIsEnoughBalance(isEnough);
    }
  }, [askedTokenAmount, tokenBalance, setIsEnoughBalance]);
  return (
    <WrapperStyled theme={currentTheme} isEnoughBalance={isEnoughBalance}>
      {askedTokenAmount ? (
        <AmountFieldInput
          isLoading={!tokenBalance}
          id={`balance-${tokenBalance?.token.symbol}`}
          key={`balance-${tokenBalance?.token.token}`}
          compact
          label={isEnoughBalance ? 'Wallet balance' : 'Not enough'}
          tooltip="The balance of the funding token for the connected wallet."
          value={tokenBalance}
        />
      ) : (
        <FieldInput id="balance-not-selected-token" label="Wallet balance">
          <i>No token selected</i>
        </FieldInput>
      )}
    </WrapperStyled>
  );
}
