/* eslint-disable no-underscore-dangle */
import { Main } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import styled from 'styled-components';
import MainView from './components/main-view';
import ErrorBoundary from './components/utils/error-boundary';
import { DEFAULT_THEME } from './constants';
import { FilterContextProvider } from './contexts/filter.context';
import { PageContextProvider } from './contexts/page.context';
import { QuestsContextProvider } from './contexts/quests.context';
import { TransactionContextProvider } from './contexts/transaction.context';
import { WalletProvider } from './contexts/wallet.context';
import Routes from './Routes';
import background from './assets/background.svg';
import backgroundMotif from './assets/background-motif.svg';
import { customDarkTheme } from './styles/dark-theme';
import { customLightTheme } from './styles/light-theme';
import { isDarkTheme } from './utils/style.util';
import { ModalContextProvider } from './contexts/modal-context';

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
  const [currentTheme, setCurrentTheme] = useState<any>(undefined);

  useEffect(() => {
    let themeName = localStorage.getItem('forcetheme');
    if (!themeName) themeName = DEFAULT_THEME;
    setCurrentTheme(themeName === 'dark' ? customDarkTheme : customLightTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme._appearance === 'dark' ? customLightTheme : customDarkTheme;
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme._appearance);
  };

  return (
    <AppStyled theme={currentTheme}>
      <WalletProvider>
        <PageContextProvider>
          <ModalContextProvider>
            <TransactionContextProvider>
              <QuestsContextProvider>
                <FilterContextProvider>
                  <Main
                    assetsUrl="/aragon-ui/"
                    layout={false}
                    scrollView={false}
                    theme={currentTheme ?? DEFAULT_THEME}
                  >
                    <HashRouter>
                      <ErrorBoundary>
                        <MainView toggleTheme={toggleTheme}>
                          <Routes />
                        </MainView>
                      </ErrorBoundary>
                    </HashRouter>
                  </Main>
                </FilterContextProvider>
              </QuestsContextProvider>
            </TransactionContextProvider>
          </ModalContextProvider>
        </PageContextProvider>
      </WalletProvider>
    </AppStyled>
  );
}
export default process.env.NODE_ENV === 'development' ? hot(App) : App;
