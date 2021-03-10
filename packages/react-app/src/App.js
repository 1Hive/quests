import React from "react";
import { HashRouter } from "react-router-dom";
import { Main } from "@1hive/1hive-ui";
import MainView from "./components/MainView";
import Routes from "./Routes";
import { WalletProvider } from "./providers/Wallet";
import { hot } from "react-hot-loader/root";

function App() {
  return (
    <WalletProvider>
      <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
        <HashRouter>
          <MainView>
            <Routes />
          </MainView>
        </HashRouter>
      </Main>
    </WalletProvider>
  );
}
export default process.env.NODE_ENV === "development" ? hot(App) : App;
