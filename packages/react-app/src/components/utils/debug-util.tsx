import { flags } from 'src/services/feature-flag.service';
import { QuestModel } from 'src/models/quest.model';
import { getNetwork } from 'src/networks';

export const feedDummyQuestData = async (questData: QuestModel): Promise<QuestModel> => {
  if (isDevelopement() && flags.DUMMY_QUEST) {
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

export const isDevelopement = () => {
  const { networkId } = getNetwork();
  return networkId === 'rinkeby' || networkId === 'local' || networkId === 'goerli';
};
