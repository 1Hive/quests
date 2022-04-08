import { Root, useViewport } from '@1hive/1hive-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useWallet } from 'src/contexts/wallet.context';
import { Logger } from 'src/utils/logger';
import { isConnected } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { usePageContext } from 'src/contexts/page.context';
import Skeleton from 'react-loading-skeleton';
import Header from './header';
import Footer from './footer';
import { BackToTop } from './back-to-top';

// #region StyledComponents

const HeaderWrapperStyled = styled.div`
  flex-shrink: 0;
  position: fixed;
  top: 0;
  width: 100%;
`;

const ContentWrapperStyled = styled.div`
  margin-top: ${({ top }: any) => top}px;
  min-height: calc(100vh - ${({ top }: any) => top}px);
  padding: ${({ isSmallResolution }: any) => (isSmallResolution ? '0' : '0 0 0 0')};
`;

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
  const { below } = useViewport();

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
          <Header toggleTheme={toggleTheme} />
        </HeaderWrapperStyled>
        <ContentWrapperStyled isSmallResolution={below('medium')}>
          {page ? children : <Skeleton /> /* TODO Put some spinner here}  */}
        </ContentWrapperStyled>
        <Footer />
      </ScrollViewStyled>
      {scrollTopState > 0 && <BackToTop />}
    </Root.Provider>
  );
}

export default MainView;
