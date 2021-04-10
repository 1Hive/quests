import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import Web3 from 'web3';
import { CRYPTOS, QUEST_STATUS } from '../constants';

// #region Private

const fakeDb = [
  {
    status: QUEST_STATUS.active,
    address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
    players: 0,
    data: {
      title: 'Rescue me',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.',
      maxPlayers: 1,
      bounty: { amount: 1000, token: CRYPTOS.theter },
      collateral: { amount: 230, token: CRYPTOS.qutheterestgold },
      tags: ['Backend', 'Oracle', 'SQL', 'CoolStuf'],
      expiration: '06/24/2021',
    },
  },
  {
    status: QUEST_STATUS.draft,
    address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    players: 0,
    data: {
      title: 'Foldondord',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.',
      maxPlayers: 2,
      bounty: { amount: 230, token: CRYPTOS.questgold },
      collateral: { amount: 50, token: CRYPTOS.questgold },
      tags: ['React', 'CoolStuf'],
      expiration: '06/24/2021',
    },
  },
  {
    status: QUEST_STATUS.active,
    address: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
    players: 5,
    data: {
      title: 'Beat the poggers',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.',
      maxPlayers: 10,
      bounty: { amount: 10, token: CRYPTOS.honey },
      collateral: { amount: 0, token: CRYPTOS.honey },
      tags: ['FrontEnd', 'Angular', 'JS', 'CoolStuf'],
      expiration: '06/24/2021',
    },
  },
];

// #endregion

export function getMoreQuests(currentIndex, count, filter) {
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
            !res.data.tags.filter((tag) => filter.tags.includes(tag)).length
          ) {
            return false;
          }
          // Search
          if (
            filter.search &&
            !res.data.title.includes(filter.search) &&
            !res.data.description.includes(filter.search) &&
            !res.address.includes(filter.search)
          ) {
            return false;
          }
          // MinBounty
          if (filter.minBounty && res.data.bounty < filter.minBounty) return false;
          if (
            (filter.expiration?.startDate &&
              moment(res.data.expiration).isBefore(filter.expiration.startDate)) ||
            (filter.expiration?.endDate &&
              moment(res.data.expiration).isAfter(filter.expiration.endDate))
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

export function saveQuest(data) {
  const web3 = new Web3('http://localhost:8545'); // your geth
  const account = web3.eth.accounts.create();
  fakeDb.push({
    data,
    players: 0,
    status: QUEST_STATUS.draft,
    address: account.address,
  });
  return Promise.resolve();
}

export function getTagSuggestions() {
  return [...new Set([].concat(...fakeDb.map((x) => x.data.tags)))];
}
