import "./Account.scss";
import React from "react";
import { Menu, Button, Dropdown } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { EllipsisOutlined } from "@ant-design/icons";


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
  blockExplorer,
}) {

  const openProfileModal = () => {

  };

  const openSettingsModal = () => {

  };

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
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(<Dropdown key="more" overlay={menu}>
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
      </Dropdown>)
    } else {
      modalButtons.push(
        <Button
          className="btn-login"
          key="loginbutton"
          shape="round"
          size="large"
          onClick={loadWeb3Modal}
        >
          Connect
        </Button>,
      );
    }
  }

  const display = minimized || !web3Modal?.cachedProvider ? (
    ""
  ) : (
      <span>
        {address ? <Address value={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} connected={web3Modal?.cachedProvider} /> : "Connecting..."}
        <Balance address={address} provider={localProvider} dollarMultiplier={price} />
        <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} />
      </span>
    );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
