import { Root } from '@1hive/1hive-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useWallet } from 'src/contexts/wallet.context';
import { Logger } from 'src/utils/logger';
import { isConnected } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { ENUM_PAGES, ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { usePageContext } from 'src/contexts/page.context';
import Header from './header';
import Footer from './footer';
import { Filter } from './filter';
import QuestModal from './modals/quest-modal';
import { BackToTop } from './back-to-top';

// #region StyledComponents

const HeaderWrapperStyled = styled.div`
  flex-shrink: 0;
  position: fixed;
  top: 0;
  width: 100%;
`;

const ContentWrapperStyled = styled.div`
  margin-top: 102px;
  min-height: calc(100vh - 102px);
`;

const ScrollViewStyled = styled.div`
  overflow-y: auto;
  margin-top: 80px;
  height: calc(100vh - 80px);
`;

const FilterWrapperStyled = styled.div``;

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
    const stickyOffset = filterRef.current?.offsetTop;
    const scrollTop = scrollViewRef.current?.scrollTop;
    setSticky(scrollTop !== undefined && stickyOffset !== undefined && scrollTop > stickyOffset);
    setScrollTop(scrollTop ?? 0);
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
            {page === ENUM_PAGES.List &&
              (sticky ? (
                <Filter compact />
              ) : (
                walletAddress && <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} />
              ))}
          </Header>
          <FilterWrapperStyled ref={filterRef}>
            {!sticky && page === ENUM_PAGES.List && <Filter />}
          </FilterWrapperStyled>
        </HeaderWrapperStyled>
        {page === ENUM_PAGES.List ? (
          <ContentWrapperStyled>{children}</ContentWrapperStyled>
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
