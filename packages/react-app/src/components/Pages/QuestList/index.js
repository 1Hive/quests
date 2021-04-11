import { Split } from '@1hive/1hive-ui';
import React from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EVENTS } from '../../../constants';
import EventManager from '../../../providers/EventManager';
import QuestProvider from '../../../providers/QuestProvider';
import Quest from '../../Shared/Quest';
import { Outset } from '../../Shared/Utils/spacer-util';
import QuestListFilter from './QuestListFilter';

const batchSize = 3;

export default class QuestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quests: [],
      placeholderCount: 3,
      hasMore: true,
      filter: {},
    };
  }

  componentDidMount() {
    this.refresh();
    EventManager.addListener(EVENTS.QUEST_SAVED, this.onQuestSaved);
  }

  componentWillUnmount() {
    EventManager.removeListener(EVENTS.QUEST_SAVED, this.onQuestSaved);
  }

  onQuestSaved = () => {
    this.refresh();
  };

  onFilterChange = async (filter) => {
    this.setState({ filter }, () => this.refresh());
  };

  refresh = async () => {
    this.setState(
      {
        quests: [],
        placeholderCount: batchSize,
      },
      () => {
        QuestProvider.getMoreQuests(0, batchSize, this.state.filter).then((res) =>
          this.setState(
            {
              quests: res.data,
              placeholderCount: 0,
              hasMore: res.hasMore,
            },
            () => {},
          ),
        );
      },
    );
  };

  loadMore = async () => {
    this.setState(
      (prevState) => ({ placeholderCount: prevState.placeholderCount + batchSize }),
      () => {
        QuestProvider.getMoreQuests(this.state.quests.length, batchSize, this.state.filter).then(
          (res) => {
            this.setState((prevState) => ({
              quests: prevState.quests.concat(res.data),
              placeholderCount: prevState.placeholderCount - batchSize,
              hasMore: res.hasMore,
            }));
          },
        );
      },
    );
  };

  render() {
    return (
      <>
        <Split
          invert="vertical"
          primary={
            <InfiniteScroll
              loader={<></>}
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
              pullDownToRefreshContent={<h3 className="center">&#8595; Pull down to refresh</h3>}
              releaseToRefreshContent={<h3 className="center">&#8593; Release to refresh</h3>}
              scrollableTarget="scroll-view"
              scrollThreshold="0px"
            >
              <div>
                {this.state.quests
                  .concat(
                    [...new Array(this.state.placeholderCount ?? 0)].map(() => ({
                      isLoading: true,
                    })),
                  )
                  .map((x, index) => (
                    <Outset gu16 key={`${index ?? ''}-${x.address ?? ''}`}>
                      <Quest
                        meta={x.meta}
                        players={x.players}
                        address={x.address}
                        creator={x.creator}
                        funds={x.funds}
                        status={x.status}
                        isLoading={x.isLoading}
                      />
                    </Outset>
                  ))}
              </div>
            </InfiniteScroll>
          }
          secondary={<QuestListFilter onFilterChange={this.onFilterChange} />}
        />
      </>
    );
  }
}
