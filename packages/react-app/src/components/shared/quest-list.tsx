import { debounce } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import Quest from 'src/components/shared/quest';
import { QUEST_MODE } from 'src/constants';
import { QuestData } from 'src/models/quest-data';
import * as QuestService from 'src/services/quest.service';
import { Filter } from '../../models/filter';
import { useFilterContext } from '../../providers/filter.context';
import { Outset } from './utils/spacer-util';

const batchSize = 3;

export default function QuestList() {
  const [quests, setQuests] = useState<QuestData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // @ts-ignore
  const { filter } = useFilterContext();

  const refresh = (_filter?: Filter) => {
    if (!isLoading) {
      setQuests([]);
      setIsLoading(true);
      QuestService.getMoreQuests(0, batchSize, _filter ?? filter).then((res) => {
        setIsLoading(false);
        setQuests(res);
        setHasMore(res.length >= batchSize);
      });
    }
  };

  const loadMore = () => {
    setIsLoading(true);
    QuestService.getMoreQuests(quests.length, batchSize, filter).then((res) => {
      setIsLoading(false);
      setQuests(quests.concat(res));
      setHasMore(res.length >= batchSize);
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

  const debounceFilter = useCallback(
    debounce((nextFilter) => refresh(nextFilter), 500),
    [], // will be created only once initially
  );
  useEffect(() => {
    debounceFilter(filter);
    return () => debounceFilter.cancel();
  }, [filter]);

  return (
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
      scrollThreshold="50px"
    >
      <div>
        {quests.map((x) => (
          <Outset gu16 key={x.address}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Quest questMode={QUEST_MODE.READ} {...x} />
          </Outset>
        ))}
        {isLoading && skeletonQuests}
      </div>
    </InfiniteScroll>
  );
}
