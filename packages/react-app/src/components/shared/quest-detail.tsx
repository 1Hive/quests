import { useEffect, useState } from 'react';
import { PAGES, QUEST_MODE } from 'src/constants';
import { useQuery } from 'src/hooks/use-query-params';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import { getQuest } from 'src/services/quest.service';
import { useToast } from '@1hive/1hive-ui';
import Quest from './quest';

export default function QuestDetail() {
  const { setPage } = usePageContext();
  const id = useQuery().get('id');
  const toast = useToast();
  const [quest, setQuest] = useState<QuestModel>();

  useEffect(() => {
    setPage(PAGES.Detail);
    const fetchQuest = async (questAddress: string) => {
      const q = await getQuest(questAddress);
      if (!q) toast('Failed to get quest, verify address');
      else setQuest(q);
    };
    if (id) fetchQuest(id);
  }, [id]);

  return (
    <>
      {quest ? (
        <Quest data={quest} questMode={QUEST_MODE.ReadDetail} />
      ) : (
        <>
          <Quest isLoading />
        </>
      )}
    </>
  );
}
