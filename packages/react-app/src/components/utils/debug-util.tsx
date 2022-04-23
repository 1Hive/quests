import { QuestModel } from 'src/models/quest.model';
import { getNetwork } from 'src/networks';

export const feedDummyQuestData = async (questData: QuestModel): Promise<QuestModel> => {
  const { type } = getNetwork();
  if (type === 'rinkeby' && localStorage.getItem('FLAG_DUMMY')?.toLowerCase() === 'true') {
    // Load dummy data only for rinkeby testing and flag activated
    const resp = await fetch('https://jaspervdj.be/lorem-markdownum/markdown.txt');
    const dummyData = await resp.text();
    return {
      ...(questData ?? {}),
      title: dummyData.substring(1, dummyData.indexOf('\n')),
      description: dummyData.slice(dummyData.indexOf('\n') + 1),
    };
  }
  return questData;
};
