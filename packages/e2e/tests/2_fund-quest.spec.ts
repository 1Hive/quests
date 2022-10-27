// import {
//   connectWithMetamask,
//   executeTransaction,
//   expectTextExistsInPage,
//   fillInputBySelector,
//   gotoApp,
//   sleep,
//   waitForSelectorAndClick,
//   waitForSelectorAndEval,
// } from '../helpers/utils';

// describe('Fund quest', () => {
//   beforeAll(async () => {
//     await gotoApp();
//     await connectWithMetamask();
//   });

//   beforeEach(async () => {
//     await page.bringToFront();
//     await gotoApp(); // Make sure start from home page
//     await page.waitForNetworkIdle();
//   });

//   it('should have funded the quest', async () => {
//     await waitForSelectorAndClick('.quest');
//     console.info('Quest clicked');
//     const bountyText = await waitForSelectorAndEval(
//       '.bounty button',
//       (el) => el.textContent!,
//     );
//     const bountyTextSplit = bountyText.split(' ');
//     const initialBounty = parseFloat(bountyTextSplit[0]);
//     const bountyToken = bountyTextSplit[1];
//     console.info('Initial bounty', initialBounty);
//     console.info('Bounty token', bountyToken);
//     await page.waitForSelector('#title-wrapper');
//     console.info('Quest loaded');
//     await waitForSelectorAndClick('.open-fund-button');
//     console.info('Fund button clicked');
//     const fundAmount = 1;
//     await fillInputBySelector('#fundAmount', fundAmount.toString());
//     console.info('Fund amount filled');
//     await waitForSelectorAndClick('.submit-fund-button:not([disabled])');
//     console.info('Submit button clicked');
//     await executeTransaction();
//     console.info('Fund transaction completed');
//     await waitForSelectorAndClick('[title="Close"]');
//     console.info('Modale closed');
//     await sleep(1000); // Waiting for balance to be fetched
//     await expectTextExistsInPage(
//       `${initialBounty + fundAmount} ${bountyToken}`,
//     );
//   });
// });
