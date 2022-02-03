import { EmptyStateCard, Button } from '@1hive/1hive-ui';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import Quest from 'src/components/quest';
import {
  ENUM_PAGES,
  ENUM_QUEST_STATE,
  ENUM_QUEST_VIEW_MODE,
  QUESTS_PAGE_SIZE,
  DEFAULT_FILTER,
} from 'src/constants';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import * as QuestService from 'src/services/quest.service';
import { useQuestsContext } from 'src/contexts/quests.context';
import styled from 'styled-components';
import { useFilterContext } from '../../contexts/filter.context';
import { Outset } from '../utils/spacer-util';

const EmptyStateCardStyled = styled(EmptyStateCard)`
  width: 100%;

  button {
    width: fit-content;
    margin: auto;
  }
`;

const skeletonQuests: any[] = [];
for (let i = 0; i < QUESTS_PAGE_SIZE; i += 1) {
  skeletonQuests.push(
    <Outset gu16 key={`${i}`}>
      <Quest
        dataState={{ questData: { expireTime: new Date(), state: ENUM_QUEST_STATE.Draft } }}
        isLoading
      />
    </Outset>,
  );
}

export default function QuestList() {
  const [quests, setQuests] = useState<QuestModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { filter, refreshed, setFilter } = useFilterContext();
  const { newQuest } = useQuestsContext();

  const { setPage } = usePageContext();
  useEffect(() => setPage(ENUM_PAGES.List), [setPage]);

  useEffect(() => {
    debounceRefresh(filter);
    return () => debounceRefresh.cancel();
  }, [filter]);

  useEffect(() => {
    debounceRefresh();
    return () => debounceRefresh.cancel();
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

  const debounceRefresh = useCallback(
    debounce((nextFilter?: FilterModel) => refresh(nextFilter), 500),
    [], // will be created only once initially
  );

  return (
    <InfiniteScroll
      loader={<></>}
      dataLength={quests.length}
      next={loadMore}
      hasMore={hasMore}
      endMessage={
        quests.length ? (
          <Outset gu16 className="center">
            <b>No more quests found</b>
          </Outset>
        ) : (
          <Outset gu64 className="flex-center wide">
            <EmptyStateCardStyled
              text="No quests found"
              action={<Button onClick={() => setFilter(DEFAULT_FILTER)} label="Reset filter" />}
            />
          </Outset>
        )
      }
      refreshFunction={refresh}
      pullDownToRefresh={isMobile}
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={<h3 className="center">&#8595; Pull down to refresh</h3>}
      releaseToRefreshContent={<h3 className="center">&#8593; Release to refresh</h3>}
      scrollableTarget="scroll-view"
      scrollThreshold={0.5}
    >
      <div>
        {quests.map((x: QuestModel) => (
          <Outset gu16 key={x.address}>
            <Quest questMode={ENUM_QUEST_VIEW_MODE.ReadSummary} dataState={{ questData: x }} />
          </Outset>
        ))}
        {isLoading && skeletonQuests}
      </div>
    </InfiniteScroll>
  );
}
