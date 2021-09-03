import { EthIdenticon, GU, RADIUS, shortenAddress, textStyle, useTheme } from '@1hive/1hive-ui';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useWallet } from '../../../providers/Wallet';
import HeaderModule from '../header/HeaderModule';

// #region StyledComponents

const AccountButtonBackgroundStyled = styled.div`
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
  max-width: ${16 * GU}px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ConnectedLabelStyled = styled.div`
  font-size: 11px; /* doesn’t exist in aragonUI */
  color: ${(props) => props.theme.positive};
`;

// #endregion

function AccountButton({ onClick }) {
  const theme = useTheme();
  const wallet = useWallet();
  return (
    <HeaderModule
      icon={
        <AccountButtonContainerStyled>
          <EthIdenticon address={wallet.account} radius={RADIUS} />
          <AccountButtonBackgroundStyled background={theme.positive} borderColor={theme.surface} />
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
  );
}

AccountButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AccountButton;
