import React from "react";
import { Button, Popover, Space, Typography } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { BellFilled, DownOutlined, IdcardOutlined, LoginOutlined, LogoutOutlined, BellOutlined, SettingFilled, SettingOutlined } from "@ant-design/icons";

const { Text } = Typography;
const style = {
  btnLogin: {
    background: 'linear-gradient(268.53deg, #aaf5d4 0%, #7ce0d6 100%)',
    margin: 'auto 0'
  }
}

export default class Account extends React.Component {

  parseAddress() {
    let addressShort = `${this.props.address.substring(0, 6)}...${this.props.address.substring(this.props.address.length - 4, this.props.address.length)}`;
    return (<Text copyable={this.props.address}>{addressShort}</Text>)
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
      <Space direction="vertical" style={{ width: 250 }}>
        <Text>Network : xDai</Text>
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
        <div className="mr-8">
          {this.props.address ? <Address value={this.props.address} ensProvider={this.props.mainnetProvider} blockExplorer={this.props.blockExplorer} showStatus={this.props.web3Modal?.cachedProvider} /> : "Connecting..."}
          <Popover content={popAccountContent} title={(<><IdcardOutlined /> {this.parseAddress()}</>)} placement="bottomLeft" arrowPointAtCenter>
            <Button type="link" className="p-0 mt-8">
              <DownOutlined />
            </Button>
          </Popover>
        </div>
        <Popover content={popNotifContent} title={(<><SettingFilled /> Settings</>)} arrowPointAtCenter>
          <Button type="link" >
            <SettingOutlined />
          </Button>
        </Popover>
        <Popover content={popSettingsContent} title={(<><BellFilled /> Notifications</>)} arrowPointAtCenter placement="bottomLeft" >
          <Button type="link">
            <BellOutlined />
          </Button>
        </Popover>
      </Space>
    );

    return (
      <div>
        {display}
      </div >
    );
  }
}
