import { Main } from '@1hive/1hive-ui';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import MainView from './components/Shared/MainView';
import { defaultTheme } from './constants';
import { WalletProvider } from './providers/Wallet';
import Routes from './Routes';

Sentry.init({
  dsn: 'https://c7b7714058dd4b7786c245bce6968769@o304267.ingest.sentry.io/5745124',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,
  release: `1hive-quests@${process.env.npm_package_version}`,
});

function App() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') ?? defaultTheme);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Sentry.ErrorBoundary fallback="An error has occurred">
      <WalletProvider>
        <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false} theme={currentTheme}>
          <HashRouter>
            <MainView toggleTheme={toggleTheme} currentTheme={currentTheme}>
              <Routes />
            </MainView>
          </HashRouter>
        </Main>
      </WalletProvider>
    </Sentry.ErrorBoundary>
  );
}
export default process.env.NODE_ENV === 'development' ? hot(App) : App;
