import { Root } from '@1hive/1hive-ui';
import React, { useEffect } from 'react';
import { usePageContext } from 'src/contexts/page.context';
import { useWallet } from 'src/contexts/wallet.context';
import { Logger } from 'src/utils/logger';
import { isConnected } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { ENUM_PAGES } from 'src/constants';
import Header from './header';
import MainScrollWithSidebarLayout from './side-content-layout';
import Sidebar from './sidebar';
import Footer from './footer';

// #region StyledComponents

const HeaderWrapperStyled = styled.div`
  flex-shrink: 0;
`;

// #endregion

type Props = {
  children: React.ReactNode;
  toggleTheme: Function;
};

function MainView({ children, toggleTheme }: Props) {
  const { activateWallet, walletAddress } = useWallet();
  const { page } = usePageContext();
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
    <>
      <HeaderWrapperStyled>
        <Header toggleTheme={toggleTheme} />
      </HeaderWrapperStyled>
      <Root.Provider>
        <MainScrollWithSidebarLayout
          main={children}
          side={page === ENUM_PAGES.List ? <Sidebar /> : undefined}
          footer={<Footer />}
        />
      </Root.Provider>
    </>
  );
}

export default MainView;
