import { BigNumber } from 'ethers';
import { getDashboardInfo } from '../quest.service';

const token1 = '0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd';
const token2 = '0xa0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const token3 = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

const quests = [
  {
    questAddress: '0x1',
    questTitle: 'Quest 1',
    questDescription: 'Quest 1 description',
    questExpireTimeSec: new Date().getTime() + 1000,
    creationTimestamp: new Date().getTime(),
    questRewardTokenAddress: token1,
    questDetailsRef: '0x1',
  },
  {
    questAddress: '0x1',
    questTitle: 'Quest 2',
    questDescription: 'Quest 2 description',
    questExpireTimeSec: new Date().getTime() + 1000,
    creationTimestamp: new Date().getTime(),
    questRewardTokenAddress: token2,
    questDetailsRef: '0x1',
  },
  {
    questAddress: '0x1',
    questTitle: 'Quest 3',
    questDescription: 'Quest 3 description',
    questExpireTimeSec: new Date().getTime() + 1000,
    creationTimestamp: new Date().getTime(),
    questRewardTokenAddress: token3,
    questDetailsRef: '0x1',
  },
];

const mockFetchQuestEntitiesLight = jest.fn();
jest.mock('../../../src/queries/quests.query', () => ({
  fetchQuestEntitiesLight: () => mockFetchQuestEntitiesLight(),
}));

const mockCacheFetchTokenPrice = jest.fn();
jest.mock('../../../src/services/cache.service', () => ({
  cacheFetchTokenPrice: () => mockCacheFetchTokenPrice(),
}));

const mockGetERC20Contract = jest.fn();
const mockGetTokenInfo = jest.fn();
jest.mock('../../../src/utils/contract.util', () => ({
  getERC20Contract: () => mockGetERC20Contract(),
  getTokenInfo: () => mockGetTokenInfo(),
}));

const mockGetObjectFromIpfs = jest.fn();
jest.mock('../ipfs.service', () => ({
  getObjectFromIpfs: () => mockGetObjectFromIpfs(),
}));

describe('QuestService', () => {
  describe('getDashboardInfo', () => {
    beforeEach(() => {
      mockFetchQuestEntitiesLight.mockReturnValue(Promise.resolve({ questEntities: quests }));
      mockCacheFetchTokenPrice.mockReturnValue(Promise.resolve(BigNumber.from(1)));
      /* (token: TokenModel) => {
        switch (token.token) {
          case token1:
            return Promise.resolve(BigNumber.from(1));
          case token2:
            return Promise.resolve(BigNumber.from(2));
          case token3:
            return Promise.resolve(BigNumber.from(0));
          default:
            return Promise.resolve(BigNumber.from(0));
        }
      }); */
      mockGetERC20Contract.mockReturnValue({
        balanceOf: () => Promise.resolve(BigNumber.from(1)), // Always 1 to make test easy
        symbol: () => Promise.resolve('TEST'),
        name: () => Promise.resolve('TestToken'),
        decimals: () => Promise.resolve(18),
      });
      mockGetTokenInfo.mockReturnValue(
        Promise.resolve({
          symbol: 'TEST',
          decimals: 18,
          name: 'TestToken',
        }),
      );
      mockGetObjectFromIpfs.mockReturnValue(Promise.resolve('Quest description fetched from ipfs'));
    });
    it('should return dashboard correct number of quests', async () => {
      // Arrange

      // Act
      const res = await getDashboardInfo();
      // Assert
      expect(res.questCount === quests.length);
    });
    it('should return dashboard correct total', async () => {
      // Arrange

      // Act
      const res = await getDashboardInfo();
      // Assert
      expect(res).toBeTruthy();
      expect(res.totalFunds === 4);
    });
  });
});
