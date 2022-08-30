import { Main } from '@1hive/1hive-ui';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';
import ErrorBoundary from './components/utils/error-boundary';
import { APP_TITLE, DEFAULT_THEME } from './constants';
import { FilterContextProvider } from './contexts/filter.context';
import { PageContextProvider } from './contexts/page.context';
import { TransactionContextProvider } from './contexts/transaction.context';
import { WalletProvider } from './contexts/wallet.context';
import Routes from './Routes';
import background from './assets/background.svg';
import backgroundMotif from './assets/background-motif.svg';
import { isDarkTheme } from './utils/style.util';
import { useThemeContext } from './contexts/theme.context';

// #region StyledComponents

const AppStyled = styled.div`
  ${({ theme }: any) => isDarkTheme(theme) && `background-image: url(${background});`};

  &::after {
    content: '';
    background: url(${backgroundMotif}) no-repeat center center;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0.02;
    z-index: -1;
  }
`;

// #endregion

function App() {
  const { currentTheme } = useThemeContext();

  useEffect(() => {
    document.title = APP_TITLE;
  }, []);

  return (
    <AppStyled theme={currentTheme}>
      <PageContextProvider>
        <WalletProvider>
          <TransactionContextProvider>
            <FilterContextProvider>
              <Main
                assetsUrl="/aragon-ui/"
                layout={false}
                scrollView={false}
                theme={currentTheme ?? DEFAULT_THEME}
              >
                <BrowserRouter>
                  <ErrorBoundary>
                    <Routes />
                  </ErrorBoundary>
                </BrowserRouter>
              </Main>
            </FilterContextProvider>
          </TransactionContextProvider>
        </WalletProvider>
      </PageContextProvider>
    </AppStyled>
  );
}
export default process.env.NODE_ENV === 'development' ? hot(App) : App;
