import { connectWithMetamask, gotoApp } from '../helpers/utils';

jest.retryTimes(3); //set maximum retries number

describe('Goto app', () => {
  beforeAll(async () => {
    await gotoApp();
  });

  it('should be titled "Quests"', async () => {
    await expect(page.title()).resolves.toMatch('Quests');
  });

  it('should connect with metamask', async () => {
    page.bringToFront();
    await connectWithMetamask();
    await expect(page).toMatchElement('.connected');
  });
});
