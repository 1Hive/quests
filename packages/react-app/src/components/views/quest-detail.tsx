import { useToast } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { useQueryParam } from 'src/hooks/use-query-params';
import { QuestModel } from 'src/models/quest.model';
import { usePageContext } from 'src/contexts/page.context';
import { fetchQuest } from 'src/services/quest.service';
import { Pages } from 'src/enums/pages.enum';
import Quest from '../quest';
import MainView from '../main-view';

export default function QuestDetail() {
  const { setPage } = usePageContext();
  const queryParam = useQueryParam();
  const toast = useToast();
  const [quest, setQuest] = useState<QuestModel | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    setPage(Pages.Detail);
    const fetchQuestAsync = async (questAddress: string) => {
      const questResult = await fetchQuest(questAddress);
      if (isSubscribed) {
        if (!questResult) toast('Failed to get quest, verify address');
        else setQuest(questResult);
        setLoading(false);
      }
    };
    if (queryParam?.has('id')) fetchQuestAsync(queryParam.get('id')!);
    return () => {
      isSubscribed = false;
    };
  }, [queryParam]);

  return (
    <MainView>
      <>
        {loading && <Quest isLoading />}
        {!loading && <Quest questData={quest} />}
      </>
    </MainView>
  );
}
