import { QuestModel } from 'src/models/quest.model';
import { getNetwork } from 'src/networks';

export const feedDummyQuestData = async (questData: QuestModel): Promise<QuestModel> => {
  const { type } = getNetwork();
  if (type === 'rinkeby' && localStorage.getItem('FLAG_DUMMY')?.toLowerCase() === 'true') {
    // Load dummy data only for rinkeby testing and flag activated
    const resp = await fetch('https://jaspervdj.be/lorem-markdownum/markdown.txt');
    const dummyData = await resp.text();
    const dummySplit = dummyData.split('\n');
    return {
      ...(questData ?? {}),
      title: dummySplit[0].substring(2),
      description: dummySplit.splice(4, dummySplit.length).join('\n'),
    };
  }
  return questData;
};
