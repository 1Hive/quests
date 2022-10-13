import {
  connectWithMetamask,
  gotoApp,
  waitForSelectorAndClick,
} from '../helpers/utils';

describe('Goto app', () => {
  beforeAll(async () => {
    await gotoApp();
  });

  beforeEach(async () => {
    await page.bringToFront();
    await page.reload(); // Reload the page to reset the state
    await page.waitForNetworkIdle();
  });

  it('should be titled "Quests"', async () => {
    await expect(page.title()).resolves.toMatch('Quests');
  });

  it('should connect with metamask', async () => {
    await connectWithMetamask();
    await expect(page).toMatchElement('.connected');
  });

  it('should disconnect', async () => {
    await waitForSelectorAndClick('.connected button');
    await waitForSelectorAndClick('#deactivate-button');
    await expect(page).toMatchElement('#account-button');
  });
});
