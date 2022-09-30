import {
  executeTransaction,
  expectTextExistsInPage,
  fillInputBySelector,
  sleep,
  waitForSelectorAndClick,
  waitForTestIdAndClick,
} from './utils';

export async function createQuest({ page, metamask, browser }) {
  try {
    await page.evaluate(`
      localStorage.setItem('FLAG.GOERLI.DUMMY_QUEST', true);
      window.location.reload();
    `);
    console.info('Dummy flag set');
    await sleep(3000);
    console.info('Sleep 2s');
    await waitForTestIdAndClick(page, 'open-create-quest-btn');
    console.info('Open create quest button clicked');
    const questTitle = await page.$eval('#title', (element) => element.value);
    console.info('Quest title found');
    await waitForTestIdAndClick(page, 'next-step-btn');
    console.info('Next step button clicked');
    await page.evaluate(`
           document.querySelector('#bounty-wrapper input')?.focus();
           document.dispatchEvent(new FocusEvent('focusin'));
       `);
    console.info('Bounty input focused');
    await sleep(200);
    console.info('Sleep 200ms');
    await waitForSelectorAndClick(page, '#bounty-wrapper li button');
    console.info('Bounty selected');
    await fillInputBySelector(page, '#amount-bounty', '1');
    console.info('Bounty amount filled');
    await waitForTestIdAndClick(page, 'complete-create-quest-btn');
    console.info('Complete create quest button clicked');
    try {
      await expectTextExistsInPage(page, 'Approving quest deposit');
      await executeTransaction({ page, metamask });
      console.info('Aprove transaction completed');
    } catch (error) {
      // Aproving already done so we expect the second step to pop up
      await expectTextExistsInPage(page, 'Creating Quest');
    }
    await executeTransaction({ page, metamask });
    console.info('Create quest transaction completed');
    await waitForSelectorAndClick(page, '[title="Close"]');
    console.info('Modale closed');
    await expectTextExistsInPage(page, questTitle, 60000);
  } catch (error) {
    console.error(error);
    throw new Error('❌ Failed to create quest');
  }
  console.info('✅ Quest created');
}
