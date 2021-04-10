import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import Web3 from 'web3';
import { EVENTS, QUEST_STATUS, TOKENS } from '../constants';
import EventManager from './EventManager';

// #region Private

const fakeDb = [
  {
    status: QUEST_STATUS.active,
    address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
    meta: {
      title: 'Rescue me',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.',
      maxPlayers: 1,
      bounty: { amount: 1000, token: TOKENS.theter },
      collateral: { amount: 230, token: TOKENS.qutheterestgold },
      tags: ['Backend', 'Oracle', 'SQL', 'CoolStuf'],
      expiration: '06/24/2021',
    },
    funds: [
      {
        founder: '0xe51A153E0b41518A2Ce8Dd3D7944Fa863463a514',
        amount: { amount: 1, token: TOKENS.honey },
      },
    ],
    players: [],
  },
  {
    status: QUEST_STATUS.draft,
    address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    meta: {
      title: 'Foldondord',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.',
      maxPlayers: 2,
      bounty: { amount: 230, token: TOKENS.questgold },
      collateral: { amount: 50, token: TOKENS.questgold },
      tags: ['React', 'CoolStuf'],
      expiration: '06/24/2021',
    },
    funds: [],
    players: [],
  },
  {
    status: QUEST_STATUS.active,
    address: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
    meta: {
      title: 'Beat the poggers',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.',
      maxPlayers: 10,
      bounty: { amount: 10, token: TOKENS.honey },
      collateral: { amount: 0, token: TOKENS.honey },
      tags: ['FrontEnd', 'Angular', 'JS', 'CoolStuf'],
      expiration: '06/24/2021',
    },
    funds: [],
    players: [],
  },
];

function createContractAccount() {
  const web3 = new Web3('http://localhost:8545');
  return web3.eth.accounts.create();
}

function retrieveQuest(address) {
  const quest = fakeDb.find((x) => x.address === address);
  if (!quest) throw Error(`[Quest funding] Quest was not found : ${address}`); // TODO : Implement error handler
  return quest;
}

// #endregion

// #region Public

function getMoreQuests(currentIndex, count, filter) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {
        data: fakeDb.filter((res) => {
          // Status
          if (filter.status && res.status.id !== filter.status) {
            return false;
          }
          // Tags
          if (
            filter.tags?.length &&
            !res.meta.tags.filter((tag) => filter.tags.includes(tag)).length
          ) {
            return false;
          }
          // Search
          if (
            filter.search &&
            !res.meta.title.includes(filter.search) &&
            !res.meta.description.includes(filter.search) &&
            !res.address.includes(filter.search)
          ) {
            return false;
          }
          // MinBounty
          if (filter.minBounty && res.meta.bounty < filter.minBounty) return false;
          if (
            (filter.expiration?.startDate &&
              moment(res.meta.expiration).isBefore(filter.expiration.startDate)) ||
            (filter.expiration?.endDate &&
              moment(res.meta.expiration).isAfter(filter.expiration.endDate))
          ) {
            return false;
          }

          return true;
        }),
      };
      result.hasMore = result.data.length === count && currentIndex < 9;
      resolve(result);
    }, 1000);
  });
}

function saveQuest(meta, address = undefined) {
  const quest = address
    ? fakeDb.find((x) => x.address === address)
    : {
        players: [],
        status: QUEST_STATUS.draft,
        funds: [],
        totalFunds: { amount: 0, token: TOKENS.theter },
        address: createContractAccount().address,
      };
  fakeDb.push({
    ...quest,
    meta,
  });
  EventManager.dispatch(EVENTS.QUEST_SAVED, { isNew: !address, address, meta });
  return Promise.resolve(quest.address);
}

function fundQuest(founderAddress, questAddress, amount) {
  return retrieveQuest(questAddress).funds.push({
    founder: founderAddress,
    amount,
  });
}

function playQuest(playerAddress, questAddress) {
  return retrieveQuest(questAddress).players.push({
    player: playerAddress,
  });
}

function getTagSuggestions() {
  return [...new Set([].concat(...fakeDb.map((x) => x.meta.tags)))];
}

// #endregion

export default {
  getMoreQuests,
  saveQuest,
  fundQuest,
  playQuest,
  getTagSuggestions,
};
