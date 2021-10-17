import { GU, Root } from '@1hive/1hive-ui';
import React from 'react';
import styled from 'styled-components';
import Header from './header';
import Layout from './layout';

// #region StyledComponents

const MainViewStyled = styled.div`
  ${(props: any) =>
    props.currentTheme === 'dark'
      ? `
      background: #1a3a6d;  /* fallback for old browsers */
      background: -webkit-linear-gradient(-45deg, #1a3a6d, #373B44);  /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(135deg, #1a3a6d, #373B44); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

      `
      : `
      background: #ffc3ab !important; /* Old browsers */
      background: #ffc3ab !important; /* Old browsers */
      background: -moz-linear-gradient(    -45deg,    #ffc3ab 0%,    #fafae2 50%,    #cbf3ef 100%  ) !important; /* FF3.6-15 */
      background: -webkit-linear-gradient(    -45deg,    #ffc3ab 0%,    #fafae2 50%,    #cbf3ef 100%  ) !important; /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(    135deg,    #ffc3ab 0%,    #fafae2 50%,    #cbf3ef 100%  ) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffc3ab', endColorstr='#cbf3ef',GradientType=1 ) !important; /* IE6-9 fallback on horizontal gradient */
      `}

  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const HeaderWrapperStyled = styled.div`
  flex-shrink: 0;
`;

const ScrollViewStyled = styled.div`
  overflow: auto;
  height: calc(100vh - 64px);
  padding: ${3 * GU}px;
`;

// #endregion

type Props = {
  children: React.ReactNode;
  toggleTheme: Function;
  currentTheme: any;
};

function MainView({ children, toggleTheme, currentTheme }: Props) {
  // const wallet = useWallet();
  // useEffect(() => {
  //   if (isConnected() && !wallet.account) wallet.activate(); // Auto connect to metamask
  // }, []); // Run only once
  return (
    <MainViewStyled currentTheme={currentTheme}>
      <HeaderWrapperStyled>
        <Header toggleTheme={toggleTheme} currentTheme={currentTheme} />
      </HeaderWrapperStyled>
      <Root.Provider>
        <ScrollViewStyled id="scroll-view">
          <Layout paddingBottom={3 * GU}>{children}</Layout>
        </ScrollViewStyled>
      </Root.Provider>
    </MainViewStyled>
  );
}

export default MainView;
