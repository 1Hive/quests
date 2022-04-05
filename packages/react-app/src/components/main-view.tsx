import { Root } from '@1hive/1hive-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useWallet } from 'src/contexts/wallet.context';
import { Logger } from 'src/utils/logger';
import { isConnected } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { ENUM_PAGES } from 'src/constants';
import { usePageContext } from 'src/contexts/page.context';
import Piggy from 'src/assets/piggy';
import { GUpx } from 'src/utils/style.util';
import Header from './header';
import Footer from './footer';
import { Filter } from './filter';
import Dashboard from './dashboard';
import { BackToTop } from './back-to-top';

// #region StyledComponents

const HeaderWrapperStyled = styled.div`
  flex-shrink: 0;
  position: fixed;
  top: 0;
  width: 100%;
`;

const ContentWrapperStyled = styled.div``;

const ScrollViewStyled = styled.div`
  margin-top: 80px;
  overflow-y: auto;
  height: calc(100vh - 80px);
  /* custom scrollbar */
  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
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

const FilterWrapperStyled = styled.div``;

const LineStyled = styled.div`
  display: flex;
  flex-direction: row;
  height: 200px;
  margin: ${GUpx(2)} ${GUpx(10)};
  align-items: flex-end;
`;

// #endregion

type Props = {
  children: React.ReactNode;
  toggleTheme: Function;
};

function MainView({ children, toggleTheme }: Props) {
  const { activateWallet, walletAddress } = useWallet();
  const [sticky, setSticky] = useState(false);
  const [scrollTopState, setScrollTop] = useState(0);
  const filterRef = useRef<HTMLDivElement>(null);
  const scrollViewRef = useRef<HTMLDivElement>(null);
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

  const handleScroll = () => {
    if (scrollViewRef?.current && filterRef?.current) {
      const filterHeight = filterRef.current.clientHeight;
      const stickyOffset = filterRef.current.offsetTop;
      const { scrollTop } = scrollViewRef.current;
      setScrollTop(scrollTop);
      setSticky(
        scrollTop !== undefined &&
          stickyOffset !== undefined &&
          scrollTop - stickyOffset > filterHeight,
      );
    }
  };

  return (
    <Root.Provider>
      <ScrollViewStyled
        ref={scrollViewRef}
        sticky={sticky}
        onScroll={handleScroll}
        id="scroll-view"
      >
        <HeaderWrapperStyled>
          <Header toggleTheme={toggleTheme}>
            {page === ENUM_PAGES.List && sticky && <Filter compact />}
          </Header>
        </HeaderWrapperStyled>

        {page === ENUM_PAGES.List ? (
          <ContentWrapperStyled>
            <LineStyled>
              <Dashboard />
              <Piggy />
            </LineStyled>
            <FilterWrapperStyled ref={filterRef}>
              {!sticky && page === ENUM_PAGES.List && <Filter />}
            </FilterWrapperStyled>
            {children}
          </ContentWrapperStyled>
        ) : (
          children
        )}
        <Footer />
      </ScrollViewStyled>
      {scrollTopState > 0 && <BackToTop />}
    </Root.Provider>
  );
}

export default MainView;
