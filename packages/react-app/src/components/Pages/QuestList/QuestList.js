import React from "react";
import { Split } from "@1hive/1hive-ui";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMoreQuests } from "../../../providers/QuestProvider";
import { isMobile } from "react-device-detect";
import QuestListFilter from "./QuestListFilter";
import { Quest } from "../../Shared/Quest/Quest";
const batchSize = 3;

export default class QuestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quests: [],
      placeholderCount: 0,
      hasMore: true,
      filter: {},
    };
  }

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
    console.log(res);
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
                  ) => (
                    <Quest
                      key={`[${index}]${address}`}
                      index={index}
                      isLoading={isLoading}
                      status={status}
                      address={address}
                      title={title}
                      description={description}
                      players={players}
                      maxPlayers={maxPlayers}
                      bounty={bounty}
                      colAmount={colAmount}
                      tags={tags}
                    ></Quest>
                  )
                )}
            </div>
          </InfiniteScroll>
        }
        secondary={
          <QuestListFilter
            onFilterChange={this.onFilterChange}
          ></QuestListFilter>
        }
      />
    );
  }
}
