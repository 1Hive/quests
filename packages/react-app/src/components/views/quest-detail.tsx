import { useEffect, useState } from 'react';
import { ENUM_PAGES, ENUM_QUEST_STATE, ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { useQuery } from 'src/hooks/use-query-params';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import { fetchQuest } from 'src/services/quest.service';
import { useToast } from '@1hive/1hive-ui';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
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
  const [quest, setQuest] = useState<QuestModel>();

  useEffect(() => {
    setPage(ENUM_PAGES.Detail);
    const fetchQuestAsync = async (questAddress: string) => {
      const q = await fetchQuest(questAddress);
      if (!q) toast('Failed to get quest, verify address');
      else setQuest(q);
    };
    if (id) fetchQuestAsync(id);
  }, [id]);

  return (
    <QuestDetailWrapperStyled>
      {quest ? (
        <Quest dataState={{ questData: quest }} questMode={ENUM_QUEST_VIEW_MODE.ReadDetail} />
      ) : (
        <>
          <Quest
            dataState={{ questData: { expireTime: new Date(), state: ENUM_QUEST_STATE.Draft } }}
            isLoading
          />
        </>
      )}
    </QuestDetailWrapperStyled>
  );
}
