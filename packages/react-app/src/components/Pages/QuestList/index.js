import { Split } from '@1hive/1hive-ui';
import { debounce } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFilterContext } from '../../../providers/FilterContext';
import QuestProvider from '../../../services/QuestService';
import Quest from '../../Shared/Quest';
import { Outset } from '../../Shared/Utils/spacer-util';
import QuestListFilter from './QuestListFilter';

const batchSize = 3;

export default function QuestList() {
  const [quests, setQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { filter, setFilter } = useFilterContext();

  const refresh = () => {
    setQuests([]);
    setIsLoading(true);
    QuestProvider.getMoreQuests(0, batchSize, filter).then((res) => {
      setIsLoading(false);
      setQuests(res.data);
      setHasMore(res.hasMore);
    });
  };

  const loadMore = () => {
    setIsLoading(true);
    QuestProvider.getMoreQuests(quests.length, batchSize, filter).then((res) => {
      setIsLoading(false);
      setQuests(quests.concat(res.data));
      setHasMore(res.hasMore);
    });
  };

  const skeletonQuests = [];
  for (let i = 0; i < batchSize; i += 1) {
    skeletonQuests.push(
      <Outset gu16 key={`${i}`}>
        <Quest isLoading />
      </Outset>,
    );
  }

  useEffect(() => {
    debounce(refresh, 200)();
  }, [filter]);

  return (
    <Split
      invert="vertical"
      primary={
        <InfiniteScroll
          loader={<></>}
          dataLength={quests.length}
          next={loadMore}
          hasMore={hasMore}
          endMessage={
            <p className="center">
              <b>No more quests found</b>
            </p>
          }
          refreshFunction={refresh}
          pullDownToRefresh={isMobile}
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={<h3 className="center">&#8595; Pull down to refresh</h3>}
          releaseToRefreshContent={<h3 className="center">&#8593; Release to refresh</h3>}
          scrollableTarget="scroll-view"
          scrollThreshold="0px"
        >
          <div>
            {quests.map((x) => (
              <Outset gu16 key={x.address}>
                <Quest
                  meta={x.meta}
                  players={x.players}
                  address={x.address}
                  creator={x.creator}
                  funds={x.funds}
                  status={x.status}
                  isLoading={x.isLoading}
                  onFilterChange={setFilter}
                />
              </Outset>
            ))}
            {isLoading && skeletonQuests}
          </div>
        </InfiniteScroll>
      }
      secondary={<QuestListFilter />}
    />
  );
}
