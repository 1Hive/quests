import "./Account.scss";
import React from "react";
import { Button, Dropdown, Space, Menu } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { EllipsisOutlined } from '@ant-design/icons';


const openProfileModal = () => {

};

const openSettingsModal = () => {

};

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer
}) {

  const loginButton = (<Button
    className="btn-login"
    key="loginbutton"
    shape="round"
    size="large"
    onClick={loadWeb3Modal}
  /*type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time*/

  >
    Connect
  </Button>);

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <a onClick={openProfileModal}>
          Profile
        </a>
      </Menu.Item>
      <Menu.Item key="settings">
        <a onClick={openSettingsModal}>
          Settings
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="selogoutttings">
        <a onClick={logoutOfWeb3Modal}>
          Logout
          </a>
      </Menu.Item>
    </Menu>
  );

  const display = minimized ? (
    ""
  ) : (
      <Space>
        {address ? <Address value={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} showStatus /> : "Connecting..."}
        <Balance address={address} provider={localProvider} dollarMultiplier={price} />
        <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} />
        <Dropdown key="more" overlay={menu}>
          <Button
            style={{
              border: 'none',
              padding: 0,
            }}
          >
            <EllipsisOutlined
              style={{
                fontSize: 20,
                verticalAlign: 'top',
              }}
            />
          </Button>
        </Dropdown>
      </Space>
    );

  return web3Modal?.cachedProvider ? loginButton : display;
}
