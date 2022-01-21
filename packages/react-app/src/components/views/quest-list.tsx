import { debounce } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import Quest from 'src/components/quest';
import { ENUM_PAGES, ENUM_QUEST_VIEW_MODE, QUESTS_PAGE_SIZE } from 'src/constants';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import * as QuestService from 'src/services/quest.service';
import { useQuestsContext } from 'src/contexts/quests.context';
import { useFilterContext } from '../../contexts/filter.context';
import { Outset } from '../utils/spacer-util';

const skeletonQuests: any[] = [];
for (let i = 0; i < QUESTS_PAGE_SIZE; i += 1) {
  skeletonQuests.push(
    <Outset gu16 key={`${i}`}>
      <Quest isLoading />
    </Outset>,
  );
}

export default function QuestList() {
  const [quests, setQuests] = useState<QuestModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { filter, refreshed } = useFilterContext();
  const { newQuest } = useQuestsContext();

  const { setPage } = usePageContext();
  useEffect(() => setPage(ENUM_PAGES.List), [setPage]);

  useEffect(() => {
    debounceFilter(filter);
    return () => debounceFilter.cancel();
  }, [filter]);

  useEffect(() => {
    refresh();
  }, [refreshed]);

  useEffect(() => {
    // Should not be nullish and not already exist in list
    if (newQuest && !quests.find((x) => x.address === newQuest.address)) {
      // Insert the newQuest at the top of the list
      setQuests([newQuest, ...quests]);
    }
  }, [newQuest]);

  const refresh = (_filter?: FilterModel) => {
    if (!isLoading) {
      setQuests([]);
      setIsLoading(true);
      QuestService.fetchQuestsPaging(0, QUESTS_PAGE_SIZE, _filter ?? filter).then((res) => {
        setIsLoading(false);
        setQuests(res);
        setHasMore(res.length >= QUESTS_PAGE_SIZE);
      });
    }
  };

  const loadMore = () => {
    setIsLoading(true);
    QuestService.fetchQuestsPaging(quests.length, QUESTS_PAGE_SIZE, filter).then((res) => {
      setIsLoading(false);
      setQuests(quests.concat(res));
      setHasMore(res.length >= QUESTS_PAGE_SIZE);
    });
  };

  const debounceFilter = useCallback(
    debounce((nextFilter) => refresh(nextFilter), 500),
    [], // will be created only once initially
  );

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
        {quests.map((x: QuestModel) => (
          <Outset gu16 key={x.address}>
            <Quest questMode={ENUM_QUEST_VIEW_MODE.ReadSummary} data={x} />
          </Outset>
        ))}
        {isLoading && skeletonQuests}
      </div>
    </InfiniteScroll>
  );
}
