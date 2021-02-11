import React from "react";
import { Button, Popover, Space, Typography } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { BellFilled, DownOutlined, ProfileFilled, LoginOutlined, LogoutOutlined, BellOutlined, SettingFilled, SettingOutlined } from "@ant-design/icons";

const { Text } = Typography;
const style = {
  btnLogin: {
    background: 'linear-gradient(268.53deg, #aaf5d4 0%, #7ce0d6 100%)',
    margin: 'auto 0'
  }
}

export default class Account extends React.Component {

  // parseAddress() {
  //   let addressShort = `${this.props.address.substring(0, 6)}...${this.props.address.substring(this.props.address.length - 4, this.props.address.length)}`;
  //   return (<Text copyable={this.props.address}>{addressShort}</Text>)
  // }

  getAddressComponent(minimized, interactable, showStatus) {
    return this.props.address ?
      (<Address minimized={minimized} interactable={interactable} showStatus={showStatus} value={this.props.address} ensProvider={this.props.mainnetProvider} blockExplorer={this.props.blockExplorer} />)
      : "Connecting...";
  }

  render() {
    const loginButton = (<Button
      key="loginbutton"
      shape="round"
      size="large"
      onClick={this.props.loadWeb3Modal}
      style={style.btnLogin}
    >
      <LoginOutlined />
      Connect
    </Button>);

    const popAccountContent = (
      <Space direction="vertical" style={{ width: 200 }}>
        {this.getAddressComponent(false, true, true)}
        <div>
          <Wallet address={this.props.address} provider={this.props.userProvider} ensProvider={this.props.mainnetProvider} price={this.props.price} />
          <Balance address={this.props.address} provider={this.props.localProvider} dollarMultiplier={this.props.price} />
        </div>
        <Button onClick={this.props.logoutOfWeb3Modal} block danger className="mt-8" type="primary">
          <LogoutOutlined />
        Disconnect
      </Button>
      </ Space>
    );

    const popNotifContent = (
      <div>
        {
        }
      </div >
    );

    const popSettingsContent = (
      <div>

      </div >
    );

    const display = this.props.minimized || !this.props.web3Modal?.cachedProvider ? loginButton : (
      <Space>
        <div>
          <Popover content={popAccountContent} title={(<><ProfileFilled /> Profile</>)} trigger="click">
            <div style={{ cursor: "pointer" }}>
              {this.getAddressComponent(false, false, true)}
              <Button type="link" className="p-8">
                <DownOutlined />
              </Button>
            </div>
          </Popover>
        </div>
        <div>
          <Popover content={popNotifContent} title={(<><SettingFilled /> Settings</>)} arrowPointAtCenter trigger="click">
            <Button type="link" className="p-8">
              <SettingOutlined />
            </Button>
          </Popover>
          <Popover content={popSettingsContent} title={(<><BellFilled /> Notifications</>)} arrowPointAtCenter placement="bottomLeft" trigger="click">
            <Button type="link" className="p-8">
              <BellOutlined />
            </Button>
          </Popover>
        </div>
      </Space>
    );

    return (
      <div>
        {display}
      </div >
    );
  }
}
