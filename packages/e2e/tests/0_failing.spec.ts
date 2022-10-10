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
  });

  it('success 1', () => {
    console.log('success 1');
  });
  it('should failed', () => {
    console.log('Trying to fail');
    throw new Error('Failed');
  });
  it('success 2', () => {
    console.log('success 2');
  });

  afterAll(async () => {
    // await page.close();
  });
});
