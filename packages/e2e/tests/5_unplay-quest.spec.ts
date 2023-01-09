import {
  connectWithMetamask,
  debug,
  executeTransaction,
  expectTextExistsInPage,
  fillInputBySelector,
  gotoApp,
  sleep,
  waitForSelectorAndClick,
} from '../helpers/utils';

describe('Claim quest', () => {
  beforeAll(async () => {
    await gotoApp();
    await connectWithMetamask();
  });

  beforeEach(async () => {
    await page.bringToFront();
    await gotoApp(); // Make sure start from home page
    await page.waitForNetworkIdle();
  });

  it('should claim quest', async () => {
    const claimPayload = {
      evidence: `Generated evidence of completion #${Math.round(
        Math.random() * 1000000,
      )}`,
      claimAmount: '1',
      contact: `Tester${Math.round(Math.random() * 1000000)}@gmail.com`,
    };
    await waitForSelectorAndClick('.quest', {
      waitForNavigation: true,
    });
    console.info('Quest clicked');
    await waitForSelectorAndClick('.open-unplay-button', {
      waitForNavigation: true,
    });
    await waitForSelectorAndClick('.submit-unplay-button');
    await executeTransaction();
    await waitForSelectorAndClick('[title="Close"]');
    await sleep(5000);
  });
});
