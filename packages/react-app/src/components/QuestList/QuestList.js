import React from "react";
import { CRYPTOS, QUEST_STATUS } from "../../constants";
import {
  AddressField,
  Box,
  Card,
  DateRangePicker,
  DropDown,
  Field,
  SearchInput,
  Split,
  Tag,
  TextInput,
  TokenBadge,
} from "@1hive/1hive-ui";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";

const currencyOptions = CRYPTOS.map((c) => c.symb);
const questStatusOptions = ["All"].concat(QUEST_STATUS.map((x) => x.name));
const batchSize = 3;

export default class QuestList extends React.Component {
  loadMoreButtonRef;
  state = {
    data: [],
    placeholders: [],
    hasMore: true,
    filter: {
      search: "",
      status: "All",
      expiration: { start: null, end: null },
      tags: ["CoolStuff"],
      minBounty: 0,
      bountyCurrency: currencyOptions[0],
      showFull: false,
    },
  };
  componentDidMount() {
    this.refresh();
  }
  getData(callback) {
    setTimeout(() => {
      callback({
        hasMore: this.state.data.length < 9,
        results: [
          {
            address: "0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9",
            title: "Beat the poggers",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 5,
            maxPlayers: 10,
            bounty: 0,
            colAmount: 0,
            tags: ["FrontEnd", "Angular", "JS", "CoolStuf"],
          },
          {
            address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
            title: "Rescue me",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 0,
            maxPlayers: 1,
            bounty: 500,
            colAmount: 25,
            tags: ["Backend", "Oracle", "SQL", "CoolStuf"],
          },
          {
            address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
            title: "Foldondord",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 0,
            maxPlayers: 2,
            bounty: 230,
            colAmount: 0,
            tags: ["React", "CoolStuf"],
          },
        ],
      });
    }, 1000);
  }
  loadMore = () => {
    this.setState({
      placeholders: [...new Array(batchSize)].map(() => ({
        placeholder: true,
      })),
    });
    this.getData((res) => {
      this.setState({
        data: this.state.data.concat(res.results),
        placeholder: this.state.placeholders.splice(0, batchSize),
        hasMore: res.hasMore,
      });
    });
  };

  refresh = () => {
    this.setState({
      data: [],
      placeholders: [...new Array(batchSize)].map(() => ({
        placeholder: true,
      })),
    });
    this.getData((res) => {
      this.setState({
        data: res.results,
        placeholder: this.state.placeholders.splice(0, batchSize),
        hasMore: res.hasMore,
      });
    });
  };

  setFilter = (filter) => {
    this.setState({ filter: { ...this.state.filter, ...filter } });
  };

  render() {
    return (
      <Split
        invert="vertical"
        primary={
          <InfiniteScroll
            dataLength={this.state.data.length}
            next={this.loadMore}
            hasMore={this.state.hasMore}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>No more quests</b>
              </p>
            }
            refreshFunction={this.refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8593; Release to refresh
              </h3>
            }
            scrollableTarget="scroll-view"
            scrollThreshold="0px"
          >
            <div>
              {this.state.data
                .concat(this.state.placeholders)
                .map(
                  (
                    {
                      placeholder,
                      address,
                      title,
                      description,
                      players,
                      maxPlayers,
                      bounty,
                      colAmount,
                      tags,
                    },
                    index
                  ) => {
                    return (
                      <Card
                        width="100%"
                        height="100%"
                        className="mb-32"
                        key={`[${index}]${address}`}
                      >
                        <Split
                          primary={
                            <div className="m-16">
                              <div className="block mt-16">
                                <Split
                                  primary={placeholder ? <Skeleton /> : title}
                                  secondary={
                                    placeholder ? (
                                      <Skeleton />
                                    ) : (
                                      <AddressField
                                        address={address}
                                        autofocus={false}
                                      />
                                    )
                                  }
                                />
                              </div>
                              <div className="block mt-16">
                                {placeholder ? (
                                  <Skeleton count={5} />
                                ) : (
                                  description
                                )}
                              </div>
                            </div>
                          }
                          secondary={
                            <div className="m-16">
                              <Field label="Number of player">
                                {placeholder ? (
                                  <Skeleton />
                                ) : (
                                  <span>
                                    {players} / {maxPlayers}
                                  </span>
                                )}
                              </Field>
                              <Field label="Bounty">
                                {placeholder ? (
                                  <Skeleton />
                                ) : (
                                  <>
                                    <span className="m-8">{bounty}</span>
                                    <TokenBadge
                                      symbol="CRO"
                                      address="0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b"
                                      networkType="main"
                                    />
                                  </>
                                )}
                              </Field>
                              <Field label="Collateral amount">
                                {placeholder ? (
                                  <Skeleton />
                                ) : (
                                  <>
                                    <span className="m-8">{colAmount}</span>
                                    <TokenBadge
                                      symbol="CRO"
                                      address="0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b"
                                      networkType="main"
                                    />
                                  </>
                                )}
                              </Field>
                              <Field label="Tags">
                                {placeholder ? (
                                  <Skeleton />
                                ) : (
                                  <>
                                    {tags.map((tag) => (
                                      <a key={tag}>
                                        <Tag>{tag}</Tag>
                                      </a>
                                    ))}
                                  </>
                                )}
                              </Field>
                            </div>
                          }
                        />
                      </Card>
                    );
                  }
                )}
            </div>
          </InfiniteScroll>
        }
        secondary={
          <Box heading="Filters" className="fit-content">
            <div className="m-16">
              <Field label="Search">
                <SearchInput
                  value={this.state.filter.search}
                  onChange={(val) => this.setFilter({ search: val })}
                />
              </Field>
            </div>
            <div className="m-16">
              <Field label="Status">
                <DropDown
                  items={questStatusOptions}
                  selected={questStatusOptions.indexOf(
                    this.state.filter.status
                  )}
                  onChange={(x) =>
                    this.setFilter({ status: questStatusOptions[x] })
                  }
                />
              </Field>
            </div>
            <div className="m-16">
              <Field label="Expiration">
                <DateRangePicker
                  startDate={this.state.filter.expiration.start}
                  endDate={this.state.filter.expiration.end}
                  onChange={(val) => this.setFilter({ expiration: val })}
                />
              </Field>
            </div>
            <div className="m-16">
              <Field label="Min bounty">
                <div className="inline-flex">
                  <TextInput
                    value={this.state.filter.minBounty}
                    onChange={(event) => {
                      this.setFilter({ minBounty: event.target.value });
                    }}
                    type="number"
                  />
                  <DropDown
                    items={currencyOptions}
                    selected={currencyOptions.indexOf(
                      this.state.filter.bountyCurrency
                    )}
                    onChange={(x) =>
                      this.setFilter({ bountyCurrency: currencyOptions[x] })
                    }
                  ></DropDown>
                </div>
              </Field>
            </div>
          </Box>
        }
      />
    );
  }
}
