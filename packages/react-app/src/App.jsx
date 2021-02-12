import React, { useCallback, useEffect, useState } from "react";
import "antd/dist/antd.css";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.scss";
import { Layout, Row, Col, Button } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { Transactor } from "./helpers";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance } from "./hooks";
import { AppHeader, Contract, Ramp, GasGauge, Faucet } from "./components";
import { formatEther } from "@ethersproject/units";
import { Switch, Route } from "react-router-dom";
import { Hints, ExampleUI, Subgraph } from "./views"
import { BrowserRouter } from "react-router-dom";
import Web3 from "web3";
//import Hints from "./Hints";
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    📡 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/
import { INFURA_ID } from "./constants";
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;

// 😬 Sorry for all the console logging 🤡
const DEBUG = true

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/" // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
//const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)
console.log("window.location.hostname", window.location.hostname)
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://" + window.location.hostname + ":8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

export default function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider); //1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if (DEBUG) console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...")

  // just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if (DEBUG) console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  if (DEBUG) console.log("📝 readContracts", readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if (DEBUG) console.log("🔐 writeContracts", writeContracts)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  //const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
  //console.log("🥇DAI contract on mainnet:",mainnetDAIContract)
  //
  // Then read your DAI balance like:
  //const myMainnetBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  //

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, "YourContract", "purpose")
  console.log("🤗 purpose:", purpose)

  //📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);
  console.log("📟 SetPurpose events:", setPurposeEvents)

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    window.web3 = new Web3(provider);
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
    if (global.web3) {
      global.web3.currentProvider.on('chainChanged', (_chainId) => window.location.reload());
    } else {

    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute]);

  const wrapperRef = React.createRef();
  const showButtonRef = React.createRef();
  const hideButtonRef = React.createRef();

  const hideFaucet = () => {
    wrapperRef.current.style.display = 'none';
    hideButtonRef.current.style.display = 'none';
    showButtonRef.current.style.display = 'block';
  }

  const showFaucet = () => {
    wrapperRef.current.style.display = 'block';
    hideButtonRef.current.style.display = 'block';
    showButtonRef.current.style.display = 'none';
  }

  return (
    <BrowserRouter>
      <Layout>
        {/* ✏️ Edit the header and change the title to your project name */}
        <AppHeader route={route} setRoute={setRoute}
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer} />
        <Content>
          <Switch>
            <Route exact path="/contract">
              {/*
                  🎛 this scaffolding is full of commonly used components
                  this <Contract/> component will automatically parse your ABI
                  and give you a form to interact with it locally
              */}
              <Contract
                name="YourContract"
                signer={userProvider.getSigner()}
                provider={localProvider}
                address={address}
                blockExplorer={blockExplorer}
              />

              { /* Uncomment to display and interact with an external contract (DAI on mainnet):
        <Contract
          name="DAI"
          customContract={mainnetDAIContract}
          signer={userProvider.getSigner()}
          provider={mainnetProvider}
          address={address}
          blockExplorer={blockExplorer}
        />*/}

            </Route>
            <Route path="/hints">
              <Hints
                address={address}
                yourLocalBalance={yourLocalBalance}
                mainnetProvider={mainnetProvider}
                price={price}
              />
            </Route>
            <Route path="/exampleui">
              <ExampleUI
                address={address}
                userProvider={userProvider}
                mainnetProvider={mainnetProvider}
                localProvider={localProvider}
                yourLocalBalance={yourLocalBalance}
                price={price}
                tx={tx}
                writeContracts={writeContracts}
                readContracts={readContracts}
                purpose={purpose}
                setPurposeEvents={setPurposeEvents}
              />
            </Route>
            <Route path="/subgraph">
              <Subgraph
                subgraphUri={props.subgraphUri}
                tx={tx}
                writeContracts={writeContracts}
                mainnetProvider={mainnetProvider}
              />
            </Route>
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Honey Quest @2021 Founded by <a href="https://1hive.org/">1Hive</a></Footer>
      </Layout>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 0, padding: 10 }}>
        <Button id="hide-faucet-button" ref={hideButtonRef} onClick={() => hideFaucet()} type="link" icon={<DownCircleOutlined style={{ fontSize: '32px' }} />}></Button>
        <Button id="show-faucet-button" ref={showButtonRef} onClick={() => showFaucet()} type="link" icon={<UpCircleOutlined style={{ fontSize: '32px' }} />}></Button>
        <div ref={wrapperRef} className="wrapper">
          <Row align="middle" gutter={[4, 4]}>
            <Col span={8}>
              <Ramp price={price} address={address} />
            </Col>

            <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
              <GasGauge gasPrice={gasPrice} />
            </Col>
            <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
              <Button
                onClick={() => {
                  window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
                }}
                size="large"
                shape="round"
              >
                <span style={{ marginRight: 8 }} role="img" aria-label="support">
                  💬
              </span>
              Support
            </Button>
            </Col>
          </Row>

          <Row align="middle" gutter={[4, 4]}>
            <Col span={24}>
              {

                /*  if the local provider has a signer, let's show the faucet:  */
                localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf(window.location.hostname) >= 0 && !process.env.REACT_APP_PROVIDER && price > 1 ? (
                  <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
                ) : (
                    ""
                  )
              }
            </Col>
          </Row>
        </div>
      </div>
    </BrowserRouter >
  );
}
/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};