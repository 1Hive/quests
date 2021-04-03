import React from 'react';
import PropTypes from 'prop-types';
import { EthIdenticon, GU, RADIUS, shortenAddress, textStyle, useTheme } from '@1hive/1hive-ui';

import styled from 'styled-components';
import { useWallet } from '../../../providers/Wallet';
import HeaderModule from '../Header/HeaderModule';

// #region StyledComponents

const AccountButtonBackground = styled.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 10px;
  height: 10px;
  background: ${({ background }) => background};
  border: 2px solid ${({ borderColor }) => borderColor};
  border-radius: 50%;
`;

const AccountButtonContainer = styled.div`
  position: relative;
`;

const AccountButtonContent = styled.div`
  margin-bottom: -5px;
  ${textStyle('body2')}
`;

const AccountButtonContentWrapper = styled.div`
  overflow: hidden;
  max-width: ${16 * GU}px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ConnectedLabel = styled.div`
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
        <AccountButtonContainer>
          <EthIdenticon address={wallet.account} radius={RADIUS} />
          <AccountButtonBackground background={theme.positive} borderColor={theme.surface} />
        </AccountButtonContainer>
      }
      content={
        <>
          <AccountButtonContent>
            <AccountButtonContentWrapper>
              {shortenAddress(wallet.account)}
            </AccountButtonContentWrapper>
          </AccountButtonContent>
          <ConnectedLabel theme={theme}>Connected</ConnectedLabel>
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
