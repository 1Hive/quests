/* eslint-disable no-unreachable */
import { disconnectAccountInMetamask } from '../helpers/metamask-override';
import {
  importAndSwitchOtherAccount,
  connectWithMetamask,
  debug,
  executeTransaction,
  expectTextExistsInPage,
  fillInputBySelector,
  gotoApp,
  sleep,
  waitForSelectorAndClick,
} from '../helpers/utils';

describe('Challenge quest', () => {
  beforeAll(async () => {
    await gotoApp();
    await importAndSwitchOtherAccount();
    await connectWithMetamask(true);
  });
  beforeEach(async () => {
    await sleep(5000);
    await page.bringToFront();
    await gotoApp(); // Make sure start from home page
    await page.waitForNetworkIdle();
  });

  it('should challenge quest', async () => {
    const challengePayload = {
      reason: `Generated reason for challenge #${Math.round(
        Math.random() * 1000000,
      )}`,
    };
    console.info('challenge test started');
    await waitForSelectorAndClick('.quest', {
      waitForNavigation: true,
    });
    console.info('Quest clicked');
    await waitForSelectorAndClick('#challenge');
    await sleep(60000);
  });
});
