import { EthIdenticon, GU, RADIUS, shortenAddress, textStyle, useTheme } from '@1hive/1hive-ui';
import styled from 'styled-components';
import { useWallet } from '../../../providers/wallet-context';
import HeaderModule from '../header/header-module';

// #region StyledComponents

const AccountButtonBackgroundStyled = styled.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 10px;
  height: 10px;
  background: ${({ background }: any) => background};
  border: 2px solid ${({ borderColor }: any) => borderColor};
  border-radius: 50%;
`;

const AccountButtonContainerStyled = styled.div`
  position: relative;
`;

const AccountButtonContentStyled = styled.div`
  margin-bottom: -5px;
  ${textStyle('body2')}
`;

const AccountButtonContentWrapperStyled = styled.div`
  overflow: hidden;
  max-width: ${16 * GU}px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ConnectedLabelStyled = styled.div`
  font-size: 11px; /* doesn’t exist in aragonUI */
  color: ${(props: any) => props.theme.positive};
`;

// #endregion

type Props = {
  onClick: Function;
};

function AccountButton({ onClick }: Props) {
  const theme = useTheme();
  const wallet = useWallet();
  return (
    wallet?.account && (
      <HeaderModule
        icon={
          <AccountButtonContainerStyled>
            <EthIdenticon address={wallet.account} radius={RADIUS} />
            <AccountButtonBackgroundStyled
              background={theme.positive}
              borderColor={theme.surface}
            />
          </AccountButtonContainerStyled>
        }
        content={
          <>
            <AccountButtonContentStyled>
              <AccountButtonContentWrapperStyled>
                {shortenAddress(wallet.account)}
              </AccountButtonContentWrapperStyled>
            </AccountButtonContentStyled>
            <ConnectedLabelStyled theme={theme}>Connected</ConnectedLabelStyled>
          </>
        }
        onClick={onClick}
      />
    )
  );
}

export default AccountButton;
