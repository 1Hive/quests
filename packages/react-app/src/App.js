/* eslint-disable no-undef */
import { Main } from '@1hive/1hive-ui';
import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import MainView from './components/Shared/MainView';
import { defaultTheme } from './constants';
import { WalletProvider } from './providers/Wallet';
import Routes from './Routes';

function App() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') ?? defaultTheme);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <WalletProvider>
      <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false} theme={currentTheme}>
        <HashRouter>
          <MainView toggleTheme={toggleTheme} currentTheme={currentTheme}>
            <Routes />
          </MainView>
        </HashRouter>
      </Main>
    </WalletProvider>
  );
}
export default process.env.NODE_ENV === 'development' ? hot(App) : App;
