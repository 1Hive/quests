import {
  connectWithMetamask,
  gotoApp,
  waitForSelectorAndClick,
} from '../helpers/utils';

jest.retryTimes(3); // set maximum retries number

describe('Goto app', () => {
  beforeAll(async () => {
    await gotoApp();
  });

  beforeEach(async () => {
    await page.bringToFront();
  });

  it('should be titled "Quests"', async () => {
    await expect(page.title()).resolves.toMatch('Quests');
  });

  it('should connect with metamask', async () => {
    await connectWithMetamask();
    await expect(page).toMatchElement('.connected');
  });

  it('should disconnect', async () => {
    await waitForSelectorAndClick('.connected');
    await waitForSelectorAndClick('#deactivate-button');
    await expect(page).toMatchElement('#account-button');
  });
});
