
import "./Address.scss";
import React from "react";
import Blockies from "react-blockies";
import { Typography, Skeleton, Badge, Space } from "antd";
import { useLookupAddress } from "../hooks";
import { If } from "../components"

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

export default function Address(props) {
  const ens = useLookupAddress(props.ensProvider, props.value);

  if (!props.value) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayAddress = props.value.substr(0, 6);

  if (ens && ens.indexOf("0x") < 0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + props.value.substr(-4);
  } else if (props.size === "long") {
    displayAddress = props.value;
  }

  const etherscanLink = blockExplorerLink(props.value, props.blockExplorer);
  if (props.minimized) {
    return (
      <span>
        <a style={{ color: "#222222" }} target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
          <Blockies seed={props.value.toLowerCase()} size={8} scale={2} />
        </a>
      </span>
    );
  }

  let text;
  if (props.onChange) {
    text = (
      <Text editable={{ onChange: props.onChange }} copyable={{ text: props.value }}>
        <a style={{ color: "#222222" }} target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
          {displayAddress}
        </a>
      </Text>
    );
  } else {
    text = (
      <Text copyable={{ text: props.value }}>
        <a style={{ color: "#222222" }} target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
          {displayAddress}
        </a>
      </Text>
    );
  }

  return (
    <Space wrap>
      {props.hideStatus ?
        <Blockies seed={props.value.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
        : <Badge status={props.connected ? "success" : "error"} title="Connected" offset={[0, 32]} size="default" dot>
          <Blockies seed={props.value.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
        </Badge>
      }
      <div className="address-detail">
        <span className="text">{text}</span>
        {props.connected ?
          <span className="status">Connected</span>
          : <span className="status">Disconnected</span>}
      </div>
    </Space>
  );
}
