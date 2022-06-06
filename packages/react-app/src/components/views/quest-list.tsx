import { EmptyStateCard, Button, useViewport } from '@1hive/1hive-ui';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import Quest from 'src/components/quest';
import {
  ENUM_PAGES,
  QUESTS_PAGE_SIZE,
  DEFAULT_FILTER,
  ENUM_TRANSACTION_STATUS,
  ENUM_QUEST_STATE,
} from 'src/constants';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import * as QuestService from 'src/services/quest.service';
import styled from 'styled-components';
import Piggy from 'src/assets/piggy';
import { GUpx } from 'src/utils/style.util';
import { useThemeContext } from 'src/contexts/theme.context';
import { ThemeInterface } from 'src/styles/theme';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { getNetwork } from 'src/networks';
import { useFilterContext } from '../../contexts/filter.context';
import { Outset } from '../utils/spacer-util';
import MainView from '../main-view';
import Dashboard from '../dashboard';
import { Filter } from '../filter';
import background from '../../assets/background.svg';

const EmptyStateCardStyled = styled(EmptyStateCard)`
  width: 100%;

  button {
    width: fit-content;
    margin: auto;
  }
`;

const FilterWrapperStyled = styled.div<{
  theme: ThemeInterface;
}>`
  position: sticky;
  top: -1px;
  width: calc(100% + 20px); // Size of scrollbar
  z-index: 1;
  background-image: url(${background});
  background-color: ${({ theme }: any) => theme.background};
`;

const LineStyled = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${GUpx(2)};
  align-items: center;
`;

const FlexContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const QuestWrapperStyled = styled.div<{
  singleColumn: boolean;
}>`
  width: ${({ singleColumn }) => (singleColumn ? '100%' : '50%')};
`;

const ScrollLabelStyled = styled.div`
  width: 100%;
  text-align: center;
  font-weight: bold;
  padding: ${GUpx(2)};
`;

export default function QuestList() {
  const [quests, setQuests] = useState<QuestModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newQuestLoading, setNewQuestLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { filter, refreshed, setFilter } = useFilterContext();
  const { currentTheme } = useThemeContext();
  const { below } = useViewport();
  const { transaction } = useTransactionContext();
  const { setPage } = usePageContext();
  const isMountedRef = useIsMountedRef();
  const network = getNetwork();

  const skeletonQuests: any[] = useMemo(() => {
    const fakeQuests = [];
    for (let i = 0; i < QUESTS_PAGE_SIZE; i += 1) {
      fakeQuests.push(
        <QuestWrapperStyled singleColumn={below('medium')} key={`${i}`}>
          <Quest isLoading isSummary />
        </QuestWrapperStyled>,
      );
    }
    return fakeQuests;
  }, []);

  useEffect(() => {
    setPage(ENUM_PAGES.List);
  }, []);

  useEffect(() => {
    debounceRefresh(filter);
    return () => debounceRefresh.cancel();
  }, [filter, network.networkId]);

  useEffect(() => {
    debounceRefresh();
    return () => debounceRefresh.cancel();
  }, [refreshed, network.networkId]);

  useEffect(() => {
    // Should not be nullish and not already exist in list
    if (
      filter.status === ENUM_QUEST_STATE.Active &&
      transaction?.type === 'QuestCreate' &&
      transaction.status === ENUM_TRANSACTION_STATUS.Confirmed &&
      filter.status !== ENUM_QUEST_STATE.Expired
    ) {
      // Insert the newQuest at the top of the list
      if (transaction.args?.questAddress) {
        // Wait for subgraph to index the new quest
        setNewQuestLoading(true);
        fetchQuestUntilNew(transaction.args.questAddress);
      }
    }
  }, [transaction?.status, transaction?.type]);

  const fetchQuestUntilNew = (newQuestAddress: string) => {
    setTimeout(async () => {
      const newQuest = await QuestService.fetchQuest(newQuestAddress);
      if (!isMountedRef.current) {
        return;
      }
      if (newQuest) {
        setQuests([newQuest, ...quests]);
        setNewQuestLoading(false);
      } else {
        fetchQuestUntilNew(newQuestAddress);
      }
    }, 1000);
  };

  const debounceRefresh = useCallback(
    debounce((nextFilter?: FilterModel) => refresh(nextFilter), 500),
    [], // will be created only once initially
  );

  const refresh = (_filter?: FilterModel) => {
    if (!isLoading) {
      setQuests([]);
      setIsLoading(true);
      QuestService.fetchQuestsPaging(0, QUESTS_PAGE_SIZE, _filter ?? filter).then((res) => {
        if (!isMountedRef.current) {
          return;
        }
        setIsLoading(false);
        setQuests(res);
        setHasMore(res.length >= QUESTS_PAGE_SIZE);
      });
    }
  };

  const loadMore = () => {
    setIsLoading(true);
    QuestService.fetchQuestsPaging(quests.length, QUESTS_PAGE_SIZE, filter).then((res) => {
      if (!isMountedRef.current) {
        return;
      }
      setIsLoading(false);
      setQuests(quests.concat(res));
      setHasMore(res.length >= QUESTS_PAGE_SIZE);
    });
  };

  return (
    <MainView>
      <LineStyled>
        <Dashboard />
        {!below('medium') && <Piggy />}
      </LineStyled>
      <FilterWrapperStyled theme={currentTheme}>
        <Filter />
      </FilterWrapperStyled>
      <InfiniteScroll
        loader={<ScrollLabelStyled>{!isLoading && <>Scroll to load more</>}</ScrollLabelStyled>}
        dataLength={quests.length}
        next={loadMore}
        hasMore={hasMore}
        endMessage={
          quests.length || newQuestLoading ? (
            <ScrollLabelStyled>No more quests found</ScrollLabelStyled>
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
        scrollThreshold={below('medium') ? '1000px' : '200px'}
      >
        <FlexContainerStyled>
          {newQuestLoading && skeletonQuests[0]}
          {quests.map((questData: QuestModel) => (
            <QuestWrapperStyled singleColumn={below('medium')} key={questData.address}>
              <Quest isSummary questData={questData} isLoading={!questData.address} />
            </QuestWrapperStyled>
          ))}
          {isLoading && skeletonQuests}
        </FlexContainerStyled>
      </InfiniteScroll>
    </MainView>
  );
}
