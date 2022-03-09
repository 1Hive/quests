/* eslint-disable no-underscore-dangle */
import { Main } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import MainView from './components/main-view';
import ErrorBoundary from './components/utils/error-boundary';
import { DEFAULT_THEME } from './constants';
import { FilterContextProvider } from './contexts/filter.context';
import { PageContextProvider } from './contexts/page.context';
import { QuestsContextProvider } from './contexts/quests.context';
import { TransactionContextProvider } from './contexts/transaction.context';
import { WalletProvider } from './contexts/wallet.context';
import Routes from './Routes';

const sharedTheme = {
  positiveSurface: '#2cc68f',
  negativeSurface: '#ff6969',
  warningSurface: '#ffe443',
};
const customLightTheme = {
  ...sharedTheme,
  _name: 'customLight',
  _appearance: 'light',
  surface: '#F9FAFC',
};
const customDarkTheme = {
  ...sharedTheme,
  _name: 'customDark',
  _appearance: 'dark',
};

function App() {
  const [currentTheme, setCurrentTheme] = useState<any>(undefined);

  useEffect(() => {
    let themeName = localStorage.getItem('theme');
    if (!themeName) themeName = DEFAULT_THEME;
    setCurrentTheme(themeName === 'dark' ? customDarkTheme : customLightTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme._appearance === 'dark' ? customLightTheme : customDarkTheme;
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme._appearance);
  };

  return (
    // Trigger sentry.io
    <WalletProvider>
      <PageContextProvider>
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
                    <MainView toggleTheme={toggleTheme} currentTheme={currentTheme}>
                      <Routes />
                    </MainView>
                  </ErrorBoundary>
                </HashRouter>
              </Main>
            </FilterContextProvider>
          </QuestsContextProvider>
        </TransactionContextProvider>
      </PageContextProvider>
    </WalletProvider>
  );
}
export default process.env.NODE_ENV === 'development' ? hot(App) : App;
