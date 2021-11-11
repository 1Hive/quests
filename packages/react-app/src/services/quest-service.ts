import { request } from 'graphql-request';
import { noop, random } from 'lodash-es';
import { log } from 'loglevel';
import { Filter } from 'src/models/filter';
import { Fund } from 'src/models/fund';
import { QuestData } from 'src/models/quest-data';
import { TokenAmount } from 'src/models/token-amount';
import { MIN_QUEST_VERSION, QUEST_STATUS, QUEST_VERSION, SUBGRAPH_URI, TOKENS } from '../constants';
import { QuestEntity } from '../queries/index';
import { wrapError } from '../utils/errors-util';
import { createContractAccount, getCurrentAccount, sendTransaction } from '../utils/web3-utils';

// #region Private

type fakeDbRow = {
  status: { id: string; label: string };
  address: string;
  meta: {
    title: string;
    description: string;
    bounty: { amount: number; token: { name: string; symb: string; address: string } };
    collateral: number;
    tags: string[];
    expire: string;
  };
  funds: Fund[];
  players: string[];
  creator: string;
};
const fakeDb: fakeDbRow[] = [];

function loadStorage() {
  const fakeDbJson = localStorage.getItem('fakeDb');
  if (fakeDbJson !== null) {
    const parsed = JSON.parse(fakeDbJson);
    parsed.forEach((element: fakeDbRow) => {
      fakeDb.push(element);
    });
  }
}

function updateStorage() {
  localStorage.setItem('fakeDb', JSON.stringify(fakeDb));
}

function generateFakeQuest(index: number) {
  fakeDb.push({
    status: QUEST_STATUS.active,
    address: createContractAccount().address,
    meta: {
      title: `Quest #${index + 1}`,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.',
      bounty: { amount: random(100, 1000), token: TOKENS.honey },
      collateral: random(0, 10),
      tags: ['FrontEnd', 'Angular', 'JS', 'CoolStuf', 'Chills', 'Spinash', 'Foo']
        .map((tag) => ({
          tag,
          rand: random() > 0,
        }))
        .filter((x) => x.rand)
        .map((x) => x.tag),
      expire: '06/24/2021',
    },
    funds: [],
    players: [],
    creator: createContractAccount().address,
  });
}

function retrieveQuest(address: string) {
  const quest = fakeDb.find((x) => x.address === address);
  if (!quest) throw Error(`[Quest funding] Quest was not found : ${address}`); // TODO : Implement error handler
  return quest;
}

function mapQuests(quests: any[]): Promise<QuestData[]> {
  return Promise.all(
    quests.map(
      async (questEntity) =>
        ({
          address: questEntity.questAddress,
          title: questEntity.questMetaTitle,
          description: questEntity.questMetaDescription,
          rewardTokenAddress: questEntity.questRewardTokenAddress,
          bounty: { amount: 0, token: TOKENS.honey }, // Fetch amount of honey for this quest or questRewardTokenAddress
          collateralPercentage: questEntity.questMetaCollateralPercentage,
          tags: questEntity.questMetaTags,
          expireTimeMs: questEntity.questExpireTimeSec * 1000, // Sec to Ms
        } as QuestData),
    ),
  );
}

loadStorage();
if (!fakeDb.length) {
  for (let index = 0; index < 10; index += 1) {
    generateFakeQuest(index);
  }
  updateStorage();
}

// #endregion

// #region Public

export async function getMoreQuests(
  currentIndex: number,
  count: number,
  filter: Filter,
): Promise<QuestData[]> {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount && (filter.foundedQuests || filter.playedQuests || filter.createdQuests)) {
    throw wrapError(
      'Trying to filter on current account when this account is not enabled nor connected',
      { filter },
    );
  }

  const queryResult = await request(SUBGRAPH_URI, QuestEntity, {
    skip: currentIndex,
    first: count,
    search: filter.search,
    minVersion: MIN_QUEST_VERSION,
  });

  return mapQuests(queryResult.questSearch);
}

export async function saveQuest(
  questFactoryContract: any,
  fallbackAddress: string,
  meta: Partial<QuestData>,
  address?: string,
) {
  if (address) throw Error('Saving existing quest is not yet implemented');
  if (questFactoryContract) {
    const tx = await questFactoryContract.createQuest(
      JSON.stringify(meta),
      TOKENS.honey.address,
      Math.round(meta.expireTimeMs! / 1000), // Ms to Sec
      fallbackAddress,
      QUEST_VERSION,
    );
    log('TX HASH', tx.hash);
    const receipt = await tx.wait();
    const questDeployedAddress = receipt?.events[0]?.args[0];
    return questDeployedAddress;
  }

  return null;
}

export async function fundQuest(
  questAddress: string,
  amount: TokenAmount,
  onCompleted: Function = noop,
) {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount)
    throw wrapError('User account not connected when trying to found a quest!', {
      questAddress,
      amount,
    });
  await sendTransaction(questAddress, amount, onCompleted);
  retrieveQuest(questAddress).funds.push({
    patron: currentAccount,
    amount,
  });
  updateStorage();
}

export async function playQuest(questAddress: string) {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount)
    throw wrapError('User account not connected when trying to play a quest!', {
      questAddress,
    });
  retrieveQuest(questAddress).players.push(currentAccount);
  updateStorage();
}

export function getTagSuggestions() {
  return fakeDb.map((x) => x.meta.tags).flat();
}

// #endregion
