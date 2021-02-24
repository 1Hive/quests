import "./Address.scss";
import React from "react";
import Blockies from "react-blockies";
import { Typography, Skeleton, Badge, Space, Tooltip } from "antd";
import { useLookupAddress } from "../hooks";
import { If } from "../components"
import { EXPECTED_NETWORK } from "../constants"

/*

  Displays an address with a blockie, links to a block explorer, and can resolve ENS

  <Address
    value={address}
    ensProvider={mainnetProvider}
    blockExplorer={optional_blockExplorer}
    fontSize={optional_fontSize}
  />

*/

const { Text } = Typography;

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

const chainMap = {
  '0x1': 'mainnet',
  '0x4': 'rinkeby',
  '0x64': 'xDai',
  '0x539': 'localhost',
}

export default function Address(props) {
  const ens = useLookupAddress(props.ensProvider, props.value);

  if (!props.value) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayAddress = props.value.substr(0, 6);;

  if (ens && ens.indexOf("0x") < 0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + props.value.substr(-4);
  } else if (props.size === "long") {
    displayAddress = props.value;
  }

  const etherscanLink = blockExplorerLink(props.value, props.blockExplorer);
  if (props.minimized) {
    const blockies = (<Blockies seed={props.value.toLowerCase()} size={8} scale={2} />);
    return props.interactable ?
      (<a style={{ color: "#222222" }} target={"_blank"} href={etherscanLink} rel="noopener noreferrer">{blockies}</a>)
      : blockies;
  }

  let text = (
    <Text editable={props.interactable && props.onChange ? { onChange: props.onChange } : false} copyable={props.interactable ? { text: props.value } : false}>
      { props.interactable ?
        (<Tooltip title={props.value.toLowerCase()}>
          <a style={{ color: "#222222" }} target={"_blank"} href={props.interactable ? etherscanLink : '#'} rel="noopener noreferrer">
            {displayAddress}
          </a>
        </Tooltip>)
        : displayAddress
      }
    </Text>
  );
  let fontSize = props.fontSize ?? 16;
  if (!props.showStatus)
    fontSize *= 1.5;

  let netwName = global.web3?.currentProvider ? chainMap[global.web3?.currentProvider.chainId] : undefined;
  let status = "status"
  if (netwName !== EXPECTED_NETWORK) {
    netwName += " (wrong network)";
    status += " disconnected"
  }

  return (
    <Space>
      {props.showStatus ?
        <Badge status="success" title="Connected" offset={[-2, 30]} size="default" >
          <Blockies toolt seed={props.value.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
        </Badge>
        : <Blockies seed={props.value.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
      }
      <div className="address-detail">
        <span className="text" style={{ fontSize }}>{text}</span>
        <If expression={props.showStatus}>
          <span className={status}>Connected {netwName ? `to ${netwName}` : ''}</span>
        </If>
      </div>
    </Space>
  );
}
