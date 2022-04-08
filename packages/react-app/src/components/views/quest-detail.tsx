import { useEffect, useState } from 'react';
import { ENUM_PAGES, ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { useQuery } from 'src/hooks/use-query-params';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import { fetchQuest } from 'src/services/quest.service';
import { useToast } from '@1hive/1hive-ui';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { Logger } from 'src/utils/logger';
import Quest from '../quest';

const QuestDetailWrapperStyled = styled.div`
  padding: ${GUpx(6)};
  padding-top: ${GUpx(4)};
  min-height: calc(100vh - 64px);
`;

export default function QuestDetail() {
  const { setPage } = usePageContext();
  const id = useQuery().get('id');
  const toast = useToast();
  const [quest, setQuest] = useState<QuestModel | undefined>(undefined);
  const [a, setA] = useState<boolean>();

  useEffect(() => {
    let isSubscribed = true;
    Logger.debug('quest detail');
    setPage(ENUM_PAGES.Detail);
    const fetchQuestAsync = async (questAddress: string) => {
      const questResult = await fetchQuest(questAddress);
      if (isSubscribed) {
        if (!questResult) toast('Failed to get quest, verify address');
        else setQuest(questResult);
        setA(true);
      }
    };
    if (id) fetchQuestAsync(id);
    return () => {
      isSubscribed = false;
    };
  }, [id]);

  return (
    <QuestDetailWrapperStyled>
      {a && (
        <Quest
          dataState={{ questData: quest }}
          questMode={ENUM_QUEST_VIEW_MODE.ReadDetail}
          isLoading={!quest}
        />
      )}
    </QuestDetailWrapperStyled>
  );
}
