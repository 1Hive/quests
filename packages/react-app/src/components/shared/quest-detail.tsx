import { useEffect, useState } from 'react';
import { PAGES, QUEST_MODE } from 'src/constants';
import { useQuery } from 'src/hooks/use-query-params';
import { QuestModel } from 'src/models/quest-data.model';
import { usePageContext } from 'src/providers/page.context';
import { getQuest } from 'src/services/quest.service';
import Quest from './quest';

export default function QuestDetail() {
  const { setPage } = usePageContext();
  const id = useQuery().get('id');
  const [quest, setQuest] = useState<QuestModel>();

  useEffect(() => {
    setPage(PAGES.Detail);
    const fetchQuest = async (questAddress: string) => {
      const q = await getQuest(questAddress);
      setQuest(q);
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
