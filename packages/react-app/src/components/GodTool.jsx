import "./GodTool.scss";
import React, { Component } from "react";

import { GasGauge, Address, Ramp, Faucet } from ".";
import { Row, Col, Button } from "antd";
import { DownCircleOutlined, LeftCircleOutlined, RightCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
import If from "./helpers/If";

export default class GodTool extends Component {

  constructor(props) {
    super();
    this.props = props;
    this.localProvider = props.localProvider;
    this.netProvider = props.netProvider;
    this.price = props.price;
    this.address = props.address;
    this.gasPrice = props.gasPrice;
    this.wrapperRef = React.createRef();
    this.showButtonRef = React.createRef();
    this.hideButtonRef = React.createRef();
  }

  hide() {
    this.wrapperRef.current.style.display = 'none';
    this.hideButtonRef.current.style.display = 'none';
    this.showButtonRef.current.style.display = 'block';
  }

  show() {
    this.wrapperRef.current.style.display = 'block';
    this.hideButtonRef.current.style.display = 'block';
    this.showButtonRef.current.style.display = 'none';
  }

  render() {
    /* 🗺 Extra UI like gas price, eth price, faucet, and support: */
    return (
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 0, padding: 10 }}>
        <div ref={this.wrapperRef} className="wrapper">
          <Row align="middle" gutter={[8, 8]}>
            <Col span={8}>
              <Ramp price={this.price} address={this.address} />
            </Col>

            <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
              <GasGauge gasPrice={this.gasPrice} />
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
            <Col span={4}></Col>
          </Row>

          <Row align="middle" gutter={[8, 8]}>
            <Col span={24}>
              {
                /*  if the local provider has a signer, let's show the faucet:  */

                (this.localProvider?.connection?.url?.indexOf(window.location.hostname) ?? -1) >= 0
                  && !process.env.REACT_APP_PROVIDER & this.price > 0 ? (
                    <Faucet localProvider={this.localProvider} price={this.price} ensProvider={this.mainnetProvider} />
                  ) : (
                    ""
                  )
              }
            </Col>
          </Row>
        </div>
      </div >
    );
  }
}