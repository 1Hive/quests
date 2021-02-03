
import "./AppHeader.scss";
import React from "react";
import { Menu, Layout, Button, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { Account } from "./";
const { SubMenu } = Menu;
const { Header } = Layout;

export default class AppHeader extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }


  render() {
    return (
      <Header>
        <div className="title">
          <div className="logo" >
            <img src='logo.png'></img>
          </div>
          <span>Honey Quest</span>
        </div>
        <Menu onClick={(e) => this.props.setRoute(e.key)} selectedKeys={[this.props.route]} mode="horizontal">
          <Menu.Item key="/">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/quests" >
            <Link to="/quests">Your quests</Link>
          </Menu.Item>
          <Menu.Item>
            <a href="https://app.honeyswap.org/#/swap" target="_blank" rel="noopener noreferrer">
              Get Honey
              </a>
          </Menu.Item>
          <Menu.Item>
            <a href="https://github.com/felixbbertrand/honeyquests/wiki" target="_blank" rel="noopener noreferrer">
              FAQ
              </a>
          </Menu.Item>
          <SubMenu title="Exemples">
            <Menu.Item key="/contract">
              <Link onClick={() => { this.props.setRoute("/contract") }} to="/contract">YourContract</Link>
            </Menu.Item  >
            <Menu.Item key="/hints">
              <Link onClick={() => { this.props.setRoute("/hints") }} to="/hints">Hints</Link>
            </Menu.Item  >
            <Menu.Item key="/exampleui">
              <Link onClick={() => { this.props.setRoute("/exampleui") }} to="/exampleui">ExampleUI</Link>
            </Menu.Item  >
            <Menu.Item key="/subgraph">
              <Link onClick={() => { this.props.setRoute("/subgraph") }} to="/subgraph">Subgraph</Link>
            </Menu.Item  >
          </SubMenu>
        </Menu>
        <Account
          address={this.props.address}
          localProvider={this.props.localProvider}
          userProvider={this.props.userProvider}
          mainnetProvider={this.props.mainnetProvider}
          price={this.props.price}
          web3Modal={this.props.web3Modal}
          loadWeb3Modal={this.props.loadWeb3Modal}
          logoutOfWeb3Modal={this.props.logoutOfWeb3Modal}
          blockExplorer={this.props.blockExplorer}
        />
      </Header >
    )
  }
}
