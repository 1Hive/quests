import { Root, useViewport, Button, IconFilter } from '@1hive/1hive-ui';
import React, { useEffect, useRef } from 'react';
import { useWallet } from 'src/contexts/wallet.context';
import { Logger } from 'src/utils/logger';
import { isConnected } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { usePageContext } from 'src/contexts/page.context';
import Skeleton from 'react-loading-skeleton';
import { useThemeContext } from 'src/contexts/theme.context';
import { GUpx } from 'src/utils/style.util';
import { useFilterContext } from 'src/contexts/filter.context';
import Header from './header';
import Footer from './footer';
import { BackToTop } from './back-to-top';

// #region StyledComponents

const HeaderWrapperStyled = styled.div`
  flex-shrink: 0;
  position: sticky;
  top: 0;
  width: 100%;
`;

const ContentWrapperStyled = styled.div`
  padding: ${({ isSmallResolution }: any) => (isSmallResolution ? GUpx() : GUpx(4))};
  min-height: calc(100vh - 80px);
`;

const ScrollViewStyled = styled.div`
  height: calc(100vh - 80px); // Minus header height
  overflow-y: auto;
  /* custom scrollbar */
  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4a4a4a;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #a8bbbf;
  }
`;

// #endregion

type Props = {
  children: React.ReactNode;
};

function MainView({ children }: Props) {
  const { activateWallet, walletAddress } = useWallet();
  const { page } = usePageContext();
  const { below } = useViewport();
  const headerRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useThemeContext();
  const { toggleFilter } = useFilterContext();

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
      <HeaderWrapperStyled theme={currentTheme}>
        <Header>
          {below('medium') && (
            <Button
              icon={<IconFilter />}
              display="icon"
              onClick={() => toggleFilter()}
              label="Show filter"
            />
          )}
        </Header>
      </HeaderWrapperStyled>
      <ScrollViewStyled id="scroll-view" theme={currentTheme} isSmallResolution={below('medium')}>
        <ContentWrapperStyled
          isSmallResolution={below('medium')}
          top={headerRef.current?.clientHeight}
        >
          {page ? children : <Skeleton /> /* TODO Put some spinner here */}
        </ContentWrapperStyled>
        <Footer />
      </ScrollViewStyled>
      <BackToTop />
    </Root.Provider>
  );
}

export default MainView;
