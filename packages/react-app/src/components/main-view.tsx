import { Root, useViewport, Button, IconFilter } from '@1hive/1hive-ui';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { usePageContext } from 'src/contexts/page.context';
import Skeleton from 'react-loading-skeleton';
import { GUpx } from 'src/utils/style.util';
import { useFilterContext } from 'src/contexts/filter.context';
import { useQueryParam } from 'src/hooks/use-query-params';
import { setCurrentChain } from 'src/local-settings';
import { Pages } from 'src/enums/pages.enum';
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

const ContentWrapperStyled = styled.div<{
  isSmallResolution?: boolean;
}>`
  padding: ${({ isSmallResolution }) => (isSmallResolution ? GUpx(1) : GUpx(4))};
  min-height: calc(100vh - 80px);
`;

const ScrollViewStyled = styled.div`
  height: calc(100vh - 80px); // Minus header height
  overflow-y: auto;
`;

// #endregion

type Props = {
  children: React.ReactNode;
};

function MainView({ children }: Props) {
  const { page } = usePageContext();
  const { below } = useViewport();
  const { toggleFilter } = useFilterContext();
  const queryParam = useQueryParam();

  useEffect(() => {
    if (queryParam?.has('chainId')) {
      setCurrentChain(+queryParam.get('chainId')!);
    }
  }, [queryParam]);

  return (
    <Root.Provider>
      <HeaderWrapperStyled>
        <Header>
          {below('medium') && page === Pages.List && (
            <Button
              icon={<IconFilter />}
              display="icon"
              onClick={() => toggleFilter()}
              label="Show filter"
            />
          )}
        </Header>
      </HeaderWrapperStyled>
      <ScrollViewStyled id="scroll-view">
        <ContentWrapperStyled isSmallResolution={below('medium')}>
          {/* @ts-ignore */}
          {page ? children : <Skeleton /> /* TODO Put some spinner here */}
        </ContentWrapperStyled>
        <Footer />
      </ScrollViewStyled>
      <BackToTop />
    </Root.Provider>
  );
}

export default MainView;
