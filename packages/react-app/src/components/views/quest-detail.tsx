import { useToast } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { ENUM_PAGES } from 'src/constants';
import { useQuery } from 'src/hooks/use-query-params';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import { fetchQuest } from 'src/services/quest.service';
import { Logger } from 'src/utils/logger';
import Quest from '../quest';
import MainView from '../main-view';

export default function QuestDetail() {
  const { setPage } = usePageContext();
  const id = useQuery().get('id');
  const toast = useToast();
  const [quest, setQuest] = useState<QuestModel | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    Logger.debug('quest detail');
    setPage(ENUM_PAGES.Detail);
    const fetchQuestAsync = async (questAddress: string) => {
      const questResult = await fetchQuest(questAddress);
      if (isSubscribed) {
        if (!questResult) toast('Failed to get quest, verify address');
        else setQuest(questResult);
        setLoading(false);
      }
    };
    if (id) fetchQuestAsync(id);
    return () => {
      isSubscribed = false;
    };
  }, [id]);

  return (
    <MainView>
      <>
        {loading && <Quest isLoading />}
        {!loading && <Quest questData={quest} />}
      </>
    </MainView>
  );
}
