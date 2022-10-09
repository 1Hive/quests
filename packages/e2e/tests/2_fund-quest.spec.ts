import {
  connectWithMetamask,
  executeTransaction,
  expectTextExistsInPage,
  fillInputBySelector,
  gotoApp,
  sleep,
  waitForSelectorAndClick,
} from '../helpers/utils';

describe('Fund quest', () => {
  beforeAll(async () => {
    await gotoApp();
    await connectWithMetamask();
  });

  beforeEach(async () => {
    await page.bringToFront();
  });

  it('should have funded the quest', async () => {
    await waitForSelectorAndClick('.quest');
    console.info('Quest clicked');
    await page.waitForSelector('#title-wrapper');
    console.info('Quest loaded');
    await waitForSelectorAndClick('.open-fund-button');
    await fillInputBySelector('#fundAmount', '2');
  });
});
