import React from "react";
import {
  AddressField,
  Card,
  Field,
  Split,
  Tag,
  TokenBadge,
} from "@1hive/1hive-ui";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import { getMoreQuests } from "../../providers/QuestProvider";
import { isMobile } from "react-device-detect";
import QuestFilter from "./QuestFilter";
const batchSize = 3;

export default class QuestList extends React.Component {
  state = {
    quests: [],
    placeholderCount: 0,
    hasMore: true,
    filter: {},
  };

  componentDidMount() {
    this.refresh();
  }

  loadMore = async () => {
    this.setState({
      placeholderCount: this.state.placeholderCount + batchSize,
    });
    let res = await getMoreQuests(
      this.state.quests.length,
      batchSize,
      this.state.filter
    );
    this.setState({
      quests: this.state.quests.concat(res.data),
      placeholderCount: this.state.placeholderCount - batchSize,
      hasMore: res.hasMore,
    });
  };

  refresh = async () => {
    this.setState({
      quests: [],
      placeholderCount: batchSize,
    });
    let res = await getMoreQuests(0, batchSize, this.state.filter);
    this.setState({
      quests: res.data,
      placeholderCount: 0,
      hasMore: res.hasMore,
    });
  };

  onFilterChange = async (filter) => {
    this.setState({ filter }, this.refresh);
  };

  render() {
    return (
      <Split
        invert="vertical"
        primary={
          <InfiniteScroll
            dataLength={this.state.quests.length}
            next={this.loadMore}
            hasMore={this.state.hasMore}
            endMessage={
              <p className="center">
                <b>No more quests found</b>
              </p>
            }
            refreshFunction={this.refresh}
            pullDownToRefresh={isMobile}
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 className="center">&#8595; Pull down to refresh</h3>
            }
            releaseToRefreshContent={
              <h3 className="center">&#8593; Release to refresh</h3>
            }
            scrollableTarget="scroll-view"
            scrollThreshold="0px"
          >
            <div>
              {this.state.quests
                .concat(
                  [...new Array(this.state.placeholderCount)].map(() => ({
                    isLoading: true,
                  }))
                )
                .map(
                  (
                    {
                      isLoading,
                      status,
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
                                  primary={isLoading ? <Skeleton /> : title}
                                  secondary={
                                    isLoading ? (
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
                                {isLoading ? (
                                  <Skeleton count={5} />
                                ) : (
                                  description
                                )}
                              </div>
                            </div>
                          }
                          secondary={
                            <div className="m-16">
                              <Field label="Status">
                                {isLoading ? (
                                  <Skeleton />
                                ) : (
                                  <span>{status}</span>
                                )}
                              </Field>
                              <Field label="Number of player">
                                {isLoading ? (
                                  <Skeleton />
                                ) : (
                                  <span>
                                    {players} / {maxPlayers}
                                  </span>
                                )}
                              </Field>
                              <Field label="Bounty">
                                {isLoading ? (
                                  <Skeleton />
                                ) : (
                                  <>
                                    <span className="m-8">{bounty}</span>
                                    <TokenBadge
                                      symbol="HNY"
                                      address="0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9"
                                      networkType="xdai"
                                    />
                                  </>
                                )}
                              </Field>
                              <Field label="Collateral amount">
                                {isLoading ? (
                                  <Skeleton />
                                ) : (
                                  <>
                                    <span className="m-8">{colAmount}</span>
                                    <TokenBadge
                                      symbol="HNY"
                                      address="0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9"
                                      networkType="xdai"
                                    />
                                  </>
                                )}
                              </Field>
                              <Field label="Tags">
                                {isLoading ? (
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
          <QuestFilter onFilterChange={this.onFilterChange}></QuestFilter>
        }
      />
    );
  }
}
