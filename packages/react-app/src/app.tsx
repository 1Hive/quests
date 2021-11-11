import { Main } from '@1hive/1hive-ui';
import { ErrorBoundary } from '@sentry/react';
import { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import MainView from './components/shared/main-view';
import { defaultTheme } from './constants';
import { WalletProvider } from './providers/wallet-context';
import Routes from './Routes';

function App() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') ?? defaultTheme);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ErrorBoundary>
      <WalletProvider>
        <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false} theme={currentTheme}>
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
