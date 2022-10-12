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
    await page.reload(); // Reload the page to reset the state
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
    await waitForSelectorAndClick('.open-claim-button');
    console.info('Open claim button clicked');
    await fillInputBySelector('#evidence', claimPayload.evidence);
    console.info('Evidence filled');
    await waitForSelectorAndClick('.next-step-btn');
    console.info('Next step button clicked');
    await fillInputBySelector('#claimedAmount', claimPayload.claimAmount);
    console.info('Claim amount filled');
    await fillInputBySelector('#contactInformation', claimPayload.contact);
    console.info('Contact filled');
    await sleep(1000); // Waiting for balance to be fetched
    console.info('Slept 1000ms');
    await waitForSelectorAndClick('.submit-claim-button:not([disabled])');
    console.info('Submit button clicked');
    try {
      await expectTextExistsInPage('Approving claim deposit');
      await executeTransaction();
      console.info('Approve transaction completed');
    } catch (error) {
      console.warn('Might not be a problem (already approved deposit)', error);
      // Aproving already done so we expect the second step to pop up
      await expectTextExistsInPage('Scheduling claim');
    }
    await executeTransaction();
    console.info('Create quest transaction completed');
    await waitForSelectorAndClick('[title="Close"]');
    console.info('Modale closed');
    await page.waitForSelector('.claim-wrapper.loading', {
      hidden: true,
    });
    console.info('Claim loaded');
    await page.reload({
      waitUntil: ['networkidle0', 'domcontentloaded'],
    });
    console.info('Page reloaded');
    await page.click('.claim-wrapper button.toggle-collapse-button');
    console.info('Claim expanded');
    await expectTextExistsInPage(claimPayload.evidence, 30000);
    await expectTextExistsInPage(claimPayload.contact, 0);
  });
});
