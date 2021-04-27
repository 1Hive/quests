import { random } from 'lodash';
import moment from 'moment';
import { EVENTS, QUEST_STATUS, TOKENS } from '../constants';
import { wrapError } from '../utils/errors-util';
import { createContractAccount, getCurrentAccount, sendTransaction } from '../utils/web3-utils';
import EventManager from './EventManager';

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
      maxPlayers: random(5, 20),
      bounty: { amount: random(100, 1000), token: TOKENS.questgold },
      collateral: { amount: random(0, 10), token: TOKENS.questgold },
      tags: ['FrontEnd', 'Angular', 'JS', 'CoolStuf', 'Chills']
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
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {
        data: fakeDb.filter((quest) => {
          // Status
          if (filter.status && quest.status.id !== filter.status) {
            return false;
          }
          // Tags
          if (
            filter.tags?.length &&
            !quest.meta.tags.filter((tag) => filter.tags.includes(tag)).length
          ) {
            return false;
          }
          // Search
          if (
            filter.search &&
            !quest.meta.title.includes(filter.search) &&
            !quest.meta.description.includes(filter.search) &&
            !quest.address.includes(filter.search)
          ) {
            return false;
          }
          // MinBounty
          if (filter.minBounty && quest.meta.bounty < filter.minBounty) return false;
          if (
            (filter.expiration?.startDate &&
              moment(quest.meta.expiration).isBefore(filter.expiration.startDate)) ||
            (filter.expiration?.endDate &&
              moment(quest.meta.expiration).isAfter(filter.expiration.endDate))
          ) {
            return false;
          }

          // Followed quests
          if (filter.createdQuests && quest.creator !== currentAccount) return false;
          if (filter.playedQuests && !quest.players.find((x) => x.player === currentAccount))
            return false;
          if (filter.foundedQuests && !quest.funds.find((x) => x.patron === currentAccount))
            return false;

          return true;
        }),
      };
      const fullResultLenght = result.data.length;
      result.data = result.data.slice(currentIndex, currentIndex + count);
      result.hasMore = result.data.length === count && currentIndex < fullResultLenght;
      resolve(result);
    }, 1000);
  });
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
  EventManager.dispatch(EVENTS.QUEST_SAVED, { isNew, address, meta });
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
