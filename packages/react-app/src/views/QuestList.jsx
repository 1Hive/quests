/* eslint-disable jsx-a11y/accessible-emoji */
import styles from "./QuestList.module.scss"
import React from "react";
import {
  List, Avatar, Button, Skeleton, Layout, Form,
  Input,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from 'antd';

import { PlusSquareOutlined } from "@ant-design/icons";

import reqwest from "reqwest";
import { append } from "../helpers";

const { Header, Footer, Sider, Content } = Layout;

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

const data = [
  'Number of participant : 0/2',
  'Booty : 2 HNY',
  'Collateral amount : 0.1 HNY',
  (<>Tags&nbsp;:&nbsp;<a href="#Angular">#Angular</a>&nbsp;<a href="#FrontEnd">#FrontEnd</a>&nbsp;<a href="#JS">#JS</a></>),
];

export default class QuestList extends React.Component {
  loadMoreButtonRef;
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };
  componentDidMount() {
    this.getData(res => {
      this.setState({
        initLoading: false,
        data: res.results,
        list: res.results,
      });
    });

    this.loadMoreButtonRef = React.createRef();
  }
  getData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };
  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          this.loadMoreButtonRef.scrollIntoView({ behavior: "smooth" });
        },
      );
    });
  };


  onFormLayoutChange() {
  };

  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div
          className={append("center", styles.loadMore)}
        >
          <Button className="m-16" ref={(el) => { this.loadMoreButtonRef = el; }} size="large" icon={<PlusSquareOutlined />} onClick={this.onLoadMore} />
        </div>
      ) : null;

    return (
      <Layout className={styles.wrapper}>
        <Sider className={append(styles.sider, "m-32 p-16")}>
          <Form
            layout="vertical"
            onValuesChange={this.onFormLayoutChange}
          >
            <Form.Item label="Search">
              <Input />
            </Form.Item>
            <Form.Item label="Status">
              <Select>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="ended">Completed</Select.Option>
                <Select.Option value="aborted">Aborted</Select.Option>
                <Select.Option value="draft">Draft</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Expiration date max">
              <DatePicker />
            </Form.Item>
            <Form.Item label="Expiration date min">
              <DatePicker />
            </Form.Item>
            <Form.Item label="InputNumber">
              <InputNumber />
            </Form.Item>
            <Form.Item label="Switch">
              <Switch />
            </Form.Item>
          </Form>
        </Sider>
        <Content className={append(styles.content)}>
          <List className={append(styles.questList, "mt-32 mr-32")}
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item
                actions={[<a key="list-edit">edit</a>, <a key="list-more">more</a>]}
                className={append(styles.questItem, "mb-8 p-8")}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi."
                />
                <List
                  size="small"
                  dataSource={data}
                  renderItem={contentItem => <List.Item>{contentItem}</List.Item>}
                />
              </List.Item>
            )}
          />
        </Content>
      </Layout >
    );
  }
}
