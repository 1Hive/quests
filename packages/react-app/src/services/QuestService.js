import { random } from 'lodash';
import { request } from 'graphql-request';
import { QUEST_STATUS, SUBGRAPH_URI, TOKENS } from '../constants';
import { wrapError } from '../utils/errors-util';
import { createContractAccount, getCurrentAccount, sendTransaction } from '../utils/web3-utils';
import { QuestFactory } from '../queries';

// #region Private

const fakeDb = [];

function loadStorage() {
  const fakeDbJson = localStorage.getItem('fakeDb');
  if (fakeDbJson !== null) {
    const parsed = JSON.parse(fakeDbJson);
    parsed.forEach((element) => {
      fakeDb.push(element);
    });
  }
}

function updateStorage() {
  localStorage.setItem('fakeDb', JSON.stringify(fakeDb));
}

function generateFakeQuest(index) {
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
      expiration: '06/24/2021',
    },
    funds: [],
    players: [],
    creator: createContractAccount().address,
  });
}

function retrieveQuest(address) {
  const quest = fakeDb.find((x) => x.address === address);
  if (!quest) throw Error(`[Quest funding] Quest was not found : ${address}`); // TODO : Implement error handler
  return quest;
}

function mapQuests(quests) {
  return quests.map((x) => {
    const metatdata = JSON.parse(x.questMetadata);
    return {
      address: x.questAddress,
      meta: metatdata,
    };
  });
}

// #endregion

// #region Public

async function getMoreQuests(currentIndex, count, filter) {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount && (filter.foundedQuests || filter.playedQuests || filter.createdQuests)) {
    throw wrapError(
      'Trying to filter on current account when this account is not enabled nor connected',
      { filter },
    );
  }

  const queryResult = await request(SUBGRAPH_URI, QuestFactory, {
    skip: currentIndex,
    first: count,
  });

  const result = {
    data: mapQuests(queryResult.questFactories),
  };
  result.hasMore = result.data.length === count;

  return result;
}

async function saveQuest(account, meta, address = undefined) {
  const isNew = !address;
  const quest = address
    ? fakeDb.find((x) => x.address === address)
    : {
        players: [],
        status: QUEST_STATUS.draft,
        funds: [],
        totalFunds: { amount: 0, token: TOKENS.theter },
        address: createContractAccount().address,
        meta,
        creator: account,
      };
  if (isNew) {
    fakeDb.unshift(quest);
  } else {
    quest.meta = meta;
  }
  updateStorage();
  return quest.address;
}

async function fundQuest(questAddress, amount, onCompleted) {
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

async function playQuest(questAddress) {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount)
    throw wrapError('User account not connected when trying to play a quest!', {
      questAddress,
    });
  retrieveQuest(questAddress).players.push({
    player: currentAccount,
  });
  updateStorage();
}

function getTagSuggestions() {
  return [...new Set([].concat(...fakeDb.map((x) => x.meta.tags)))];
}

// #endregion

loadStorage();
if (!fakeDb.length) {
  for (let index = 0; index < 10; index += 1) {
    generateFakeQuest(index);
  }
  updateStorage();
}

export default {
  getMoreQuests,
  saveQuest,
  fundQuest,
  playQuest,
  getTagSuggestions,
};
