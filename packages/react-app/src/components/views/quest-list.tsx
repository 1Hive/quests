import { debounce } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import Quest from 'src/components/quest';
import { ENUM_PAGES, ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import * as QuestService from 'src/services/quest.service';
import { useQuestsContext } from 'src/contexts/quests.context';
import { useFilterContext } from '../../contexts/filter.context';
import { Outset } from '../utils/spacer-util';

const batchSize = 3;
const skeletonQuests: any[] = [];
for (let i = 0; i < batchSize; i += 1) {
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
  const { filter, refreshed } = useFilterContext()!;
  const { newQuest } = useQuestsContext()!;

  const { setPage } = usePageContext();
  useEffect(() => setPage(ENUM_PAGES.List), [setPage]);

  const refresh = (_filter?: FilterModel) => {
    if (!isLoading) {
      setQuests([]);
      setIsLoading(true);
      QuestService.fetchQuestsPaging(0, batchSize, _filter ?? filter).then((res) => {
        setIsLoading(false);
        setQuests(res);
        setHasMore(res.length >= batchSize);
      });
    }
  };

  const loadMore = () => {
    setIsLoading(true);
    QuestService.fetchQuestsPaging(quests.length, batchSize, filter).then((res) => {
      setIsLoading(false);
      setQuests(quests.concat(res));
      setHasMore(res.length >= batchSize);
    });
  };

  const debounceFilter = useCallback(
    debounce((nextFilter) => refresh(nextFilter), 500),
    [], // will be created only once initially
  );

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

  useEffect(() => {
    const scrollView = document.getElementById('scroll-view');
    const handleScroll = (e: WheelEvent) => {
      scrollView!.scrollTo(scrollView!.scrollLeft, scrollView!.scrollTop + e.deltaY / 2);
    };
    const preventScroll = (e: WheelEvent) => e.preventDefault();
    if (!document.onwheel) {
      document.addEventListener('wheel', handleScroll);
      scrollView!.addEventListener('wheel', preventScroll);
    }
    return () => {
      document.removeEventListener('wheel', handleScroll);
      scrollView!.removeEventListener('wheel', preventScroll);
    };
  }, []);

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
