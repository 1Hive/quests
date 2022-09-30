const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');

require('dotenv').config();

async function waitForSelectorAndClick(page, queryOverride) {
  const elementToClick = await page.waitForSelector(queryOverride);
  await elementToClick.click();
}

async function waitForTestIdAndClick(page, testid) {
  const elementToClick = await page.waitForSelector(
    `[data-testid="${testid}"]`,
  );
  await elementToClick.click();
}

async function sleep(timeout) {
  return new Promise((res) => setTimeout(res, timeout));
}

async function executeTransaction({ page, metamask }) {
  await page.waitForSelector('[data-testid="TX_WAITING_FOR_SIGNATURE"]');
  await sleep(5000);
  await metamask.confirmTransaction();
  await page.bringToFront();
  await page.waitForSelector('[data-testid="TX_STATUS_CONFIRMED"]', {
    timeout: 120000,
  });
}

/**
 * @param {puppeteer.Page} page
 * @param {string} text
 */
async function expectTextExistsInPage(page, text, timeout = 2000) {
  const xp = `//*[contains(text(),'${text}')]`;
  try {
    console.info(`Looking for text "${text}" ...`);
    const el = await page.waitForXPath(xp, {
      timeout,
    });
    if (!el) {
      throw new Error();
    }
    console.info(`Text found: "${text}"`);
  } catch (error) {
    if (error) console.error(error);
    throw new Error(`Text not found: "${text}"`);
  }
}

function fillInputBySelector(page, selector, value) {
  return page.$eval(
    selector,
    (/** @type {HTMLInputElement} */ el, /** @type {String} */ _value) => {
      el.value = _value;
      el.dispatchEvent(new Event('change'));
    },
    value,
  );
}

// This setup is for opening a new browser and importing the metamask extension as well as the test account
async function main(tries) {
  if (!process.env.E2E_SECRET_WORDS) {
    throw new Error('E2E_SECRET_WORDS not set in .env file');
  }
  let page;
  try {
    console.info('🚀 Starting browser');
    const [metamask, _page, browser] = await dappeteer.bootstrap(puppeteer, {
      metamaskVersion: 'v10.15.0',
      seed: process.env.E2E_SECRET_WORDS,
      password: '12345678',
      showTestNets: true,
      headless: false,
      args: [`--no-sandbox`, `--disable-setuid-sandbox`],
    });
    page = _page;
    console.info('✔️ Broser launched & Metamask imported');
    const pageUrl = `${process.env.VERCEL_DEPLOYMENT_URL}/home?&chainId=5`;
    console.log(`Opening page ${pageUrl} ...`);
    await page.goto(pageUrl);
    console.info(`✔️ Page loaded`);
    await metamask.switchNetwork('goerli');
    console.info('✔️ Switched to Goerli');
    await page.bringToFront();
    console.info('✔️ Page brought to front');
    const accountButton = await page.waitForSelector('#account-button');
    console.info('✔️ Account button found');
    await accountButton?.click();
    console.info('✔️ Account button clicked');
    const metamaskButton = await page.waitForSelector('#injected');
    console.info('✔️ Metamask button found');
    await metamaskButton?.click();
    console.info('✔️ Metamask button clicked');
    console.info('Sleeping 2s...');
    await sleep(2000);
    await metamask.approve();
    console.info('✔️ Metamask approved');
    console.info('Sleeping 2s...');
    await sleep(2000);
    await page.bringToFront();
    console.info('✔️ Page brought to front');
    await createQuest({ page, metamask, browser });
    await browser.close();
  } catch (error) {
    if (page) {
      await page.screenshot({
        path: `./e2e_try_n${tries}.png`,
        fullPage: true,
      });
    }
    console.error(`Try #${tries} failed : `, error);
    if (tries > 0) {
      console.log(`Retrying...`);
      main(tries - 1);
    }
  }
}

async function createQuest({ page, metamask, browser }) {
  try {
    await page.evaluate(`
    localStorage.setItem('FLAG.GOERLI.DUMMY_QUEST', true);
    window.location.reload();
  `);
    console.info('✔️ Dummy flag set');
    await sleep(3000);
    console.info('✔️ Sleep 2s');
    await waitForTestIdAndClick(page, 'open-create-quest-btn');
    console.info('✔️ Open create quest button clicked');
    const questTitle = await page.$eval('#title', (element) => element.value);
    console.info('✔️ Quest title found');
    await waitForTestIdAndClick(page, 'next-step-btn');
    console.info('✔️ Next step button clicked');
    await page.evaluate(`
         document.querySelector('#bounty-wrapper input')?.focus();
         document.dispatchEvent(new FocusEvent('focusin'));
     `);
    console.info('✔️ Bounty input focused');
    await sleep(200);
    console.info('✔️ Sleep 200ms');
    await waitForSelectorAndClick(page, '#bounty-wrapper li button');
    console.info('✔️ Bounty selected');
    await fillInputBySelector(page, '#amount-bounty', '1');
    console.info('✔️ Bounty amount filled');
    await waitForTestIdAndClick(page, 'complete-create-quest-btn');
    try {
      await expectTextExistsInPage(page, 'Approving quest deposit');
      console.info('✔️ Complete create quest button clicked');
      await executeTransaction({ page, metamask });
      console.info('✔️ Aprove transaction completed');
    } catch (error) {
      // Aproving already done so we expect the second step to pop up
      await expectTextExistsInPage(page, 'Creating Quest');
    }
    await executeTransaction({ page, metamask });
    console.info('✔️ Create quest transaction completed');
    await waitForSelectorAndClick(page, '[title="Close"]');
    console.info('✔️ Modale closed');
    await expectTextExistsInPage(page, questTitle, 60000);
  } catch (error) {
    console.error(error);
    throw new Error('❌ Failed to create quest');
  }
  console.info('✅ Quest created');
}

main(process.env.E2E_TRIES || 3);
