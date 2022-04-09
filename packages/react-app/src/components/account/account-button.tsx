/* eslint-disable import/no-unresolved */
import { EthIdenticon, RADIUS, shortenAddress, textStyle, useTheme } from '@1hive/1hive-ui';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { useWallet } from '../../contexts/wallet.context';
import HeaderModule from '../header/header-module';

// #region StyledComponents

interface AccountButtonBackgroundStyledProps {
  background: any;
  borderColor: any;
}

const AccountButtonBackgroundStyled = styled.div<AccountButtonBackgroundStyledProps>`
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 10px;
  height: 10px;
  background: ${({ background }) => background};
  border: 2px solid ${({ borderColor }) => borderColor};
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
  max-width: ${GUpx(16)};
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
  const { walletAddress } = useWallet();
  return (
    <>
      {walletAddress && (
        <HeaderModule
          icon={
            <AccountButtonContainerStyled>
              <EthIdenticon address={walletAddress} radius={RADIUS} />
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
                  {shortenAddress(walletAddress)}
                </AccountButtonContentWrapperStyled>
              </AccountButtonContentStyled>
              <ConnectedLabelStyled theme={theme}>Connected</ConnectedLabelStyled>
            </>
          }
          onClick={onClick}
        />
      )}
    </>
  );
}

export default AccountButton;
