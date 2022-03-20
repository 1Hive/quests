import { Root } from '@1hive/1hive-ui';
import React, { useEffect } from 'react';
import { useWallet } from 'src/contexts/wallet.context';
import { Logger } from 'src/utils/logger';
import { isConnected } from 'src/utils/web3.utils';
import styled from 'styled-components';
import Header from './header';
import Footer from './footer';

// #region StyledComponents

const HeaderWrapperStyled = styled.div`
  flex-shrink: 0;
`;

const ScollStyled = styled.div`
  overflow-y: auto;
  height: 100vh;
`;

// #endregion

type Props = {
  children: React.ReactNode;
  toggleTheme: Function;
};

function MainView({ children, toggleTheme }: Props) {
  const { activateWallet, walletAddress } = useWallet();
  useEffect(() => {
    const tryConnect = async () => {
      try {
        if (await isConnected()) activateWallet().catch(Logger.exception);
      } catch (error) {
        Logger.exception(error);
      }
    };
    if (!walletAddress) tryConnect();
  }, []);

  return (
    <Root.Provider>
      <ScollStyled>
        <HeaderWrapperStyled>
          <Header toggleTheme={toggleTheme} />
        </HeaderWrapperStyled>
        {children}
        <Footer />
      </ScollStyled>
    </Root.Provider>
  );
}

export default MainView;
