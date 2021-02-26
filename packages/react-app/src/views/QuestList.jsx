/* eslint-disable jsx-a11y/accessible-emoji */
import styles from "./QuestList.module.scss"
import React from "react";
import moment from "moment";
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
import { CRYPTOS, QUEST_STATUS } from "../constants";
import { Blockie } from "../components";

const { Header, Footer, Sider, Content } = Layout;
const { RangePicker } = DatePicker;

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

const data = [
  'Number of player : 0/2',
  'Booty : 2 HNY',
  'Collateral amount : 0.1 HNY',
  (<>Tags&nbsp;:&nbsp;<a href="#Angular">#Angular</a>&nbsp;<a href="#FrontEnd">#FrontEnd</a>&nbsp;<a href="#JS">#JS</a></>),
];

const currencyOptions = CRYPTOS.map(c => ({
  label: c.name,
  value: `${c.symb}`
}))

export default class QuestList extends React.Component {
  loadMoreButtonRef;
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    filter: {
      search: "",
      status: "",
      expiration: [],
      minBooty: 0,
      bootyCurrency: currencyOptions[0].value,
      showFull: false
    }
  };
  componentDidMount() {
    this.getData(res => {
      this.setState({
        initLoading: false,
        data: res.results,
        list: res.results
      });
    });

    this.loadMoreButtonRef = React.createRef();
  }
  getData = callback => {
    callback({
      results: [{
        address: "0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9",
        title: "Beat the poggers",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
        players: 5,
        maxPlayers: 10,
        booty: 0,
        colAmount: 0,
        tags: ["FrontEnd", "Angular", "JS"]
      }, {
        address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
        title: "Rescue me",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
        players: 0,
        maxPlayers: 1,
        booty: 500,
        colAmount: 25,
        tags: ["Backend", "Oracle", "SQL"]
      }, {
        address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
        title: "Foldondord",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
        players: 0,
        maxPlayers: 2,
        booty: 230,
        colAmount: 0,
        tags: ["React", "CoolStuf"]
      },]
    })
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
              <Select value={this.state.filter.status}>
                {QUEST_STATUS.map(x => (
                  <Select.Option key={x.val} value={x.val}>
                    {x.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Expiration">
              <RangePicker value={this.state.expiration} />
            </Form.Item>
            <Form.Item label="Tags">
              <Select mode="tags" >
              </Select>
            </Form.Item>
            <Form.Item label="Min booty">
              <InputNumber min={0} value={this.state.filter.minBooty} />
              <Select
                showSearch
                value={this.state.filter.bootyCurrency}
                style={{ width: 75 }}
                onChange={x => this.setState({ currency: x })}
              >
                {currencyOptions.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Show full quests">
              <Switch value={this.state.showFull}></Switch>
            </Form.Item>
          </Form>
        </Sider>
        <Content className={append(styles.content)}>
          <List className={append(styles.questList, "mt-32 mr-32")}
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={quest => (
              <List.Item
                actions={[<a key="list-edit">edit</a>, <a key="list-more">more</a>]}
                className={append(styles.questItem, "mb-8 p-8")}
              >
                <List.Item.Meta
                  avatar={
                    <Blockie address={quest.address}></Blockie>
                  }
                  title={quest.title}
                  description={quest.description}
                />
                <List
                  size="small"
                  dataSource={[`Number of player : ${quest.players}/${quest.maxPlayers}`,
                  `Booty : ${quest.booty} HNY`,
                  `Collateral amount : ${quest.colAmount} HNY`,
                  (<>Tags : {quest.tags.map(tag => (<a>{tag}</a>))}</>)]}
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
