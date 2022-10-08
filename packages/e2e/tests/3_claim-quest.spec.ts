import {
  connectWithMetamask,
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
  });

  it('should claim quest', async () => {
    const claimPayload = {
      evidence: `Generated evidence of completion #${Math.round(
        Math.random() * 1000000,
      )}`,
      claimAmount: '1',
      contact: `Tester${Math.round(Math.random() * 1000000)}@gmail.com`,
    };
    await waitForSelectorAndClick('.quest');
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
    await waitForSelectorAndClick('[type="submit"]');
    console.info('Submit button clicked');
    try {
      await expectTextExistsInPage('Approving claim deposit');
      await executeTransaction();
      console.info('Approve transaction completed');
    } catch (error) {
      // Aproving already done so we expect the second step to pop up
      await expectTextExistsInPage('Scheduling claim');
    }
    await executeTransaction();
    console.info('Create quest transaction completed');
    await waitForSelectorAndClick('[title="Close"]');
    console.info('Modale closed');
    sleep(1000);
    await waitForSelectorAndClick('.claim-wrapper .btn-link button');
    console.info('Claim button clicked');
    await expectTextExistsInPage(claimPayload.evidence, 30000);
    await expectTextExistsInPage(claimPayload.contact, 0);
  });
});
