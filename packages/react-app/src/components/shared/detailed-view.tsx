import { useEffect, useState } from 'react';
import { PAGES, QUEST_MODE } from 'src/constants';
import { useQuery } from 'src/hooks/use-query-params';
import { QuestData } from 'src/models/quest-data';
import { usePageContext } from 'src/providers/page.context';
import { getQuest } from 'src/services/quest.service';
import Quest from './quest';

export default function DetailedView() {
  const { setPage } = usePageContext();
  const query = useQuery();
  const id = query.get('id');
  const [quest, setQuest] = useState<QuestData | undefined>(undefined);

  useEffect(() => {
    setPage(PAGES.Detail);
    if (id) getQuest(id).then(setQuest);
  }, [id]);
  return <>{quest ? <Quest data={quest} questMode={QUEST_MODE.READ_DETAIL} /> : <>LOADING</>}</>;
}
