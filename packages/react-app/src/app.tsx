/* eslint-disable no-underscore-dangle */
import { Main } from '@1hive/1hive-ui';
import { ErrorBoundary } from '@sentry/react';
import { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import MainView from './components/main-view';
import { defaultTheme } from './constants';
import { WalletProvider } from './contexts/wallet.context';
import Routes from './Routes';

const customLightTheme = {
  _name: 'customLight',
  _appearance: 'light',
  surface: '#F9FAFC',
};
const customDarkTheme = {
  _name: 'customDark',
  _appearance: 'dark',
};

function App() {
  const savedTheme = localStorage.getItem('theme');
  const [currentTheme, setCurrentTheme] = useState<any>(
    savedTheme === 'dark' ? customDarkTheme : customLightTheme,
  );

  const toggleTheme = () => {
    const newTheme = currentTheme._appearance === 'dark' ? customLightTheme : customDarkTheme;
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme._appearance);
  };

  return (
    // Trigger sentry.io
    <ErrorBoundary>
      <WalletProvider>
        <Main
          assetsUrl="/aragon-ui/"
          layout={false}
          scrollView={false}
          theme={currentTheme ?? defaultTheme}
        >
          <HashRouter>
            <MainView toggleTheme={toggleTheme} currentTheme={currentTheme}>
              <Routes />
            </MainView>
          </HashRouter>
        </Main>
      </WalletProvider>
    </ErrorBoundary>
  );
}
export default process.env.NODE_ENV === 'development' ? hot(App) : App;
