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

async function approveTransaction({ page, metamask }) {
  await page.waitForSelector('[data-testid="TX_WAITING_FOR_SIGNATURE"]');
  await sleep(5000);
  await metamask.confirmTransaction();
  await page.bringToFront();
  await page.waitForSelector('[data-testid="TX_STATUS_CONFIRMED"]', {
    timeout: 60000,
  });
}

/**
 * @param {puppeteer.Page} page
 * @param {string} text
 */
async function expectTextExistsInPage(page, text) {
  const xp = `//*[contains(text(),'${text}')]`;
  try {
    console.log(`Looking for text "${text}" ...`);
    const el = await page.waitForXPath(xp, {
      timeout: 60000,
    });
    if (!el) {
      throw new Error();
    }
    console.log(`Text found: "${text}"`);
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

// const wsChromeEndpointurl =
//   'ws://127.0.0.1:9222/devtools/browser/a97436d8-bc3d-49c0-80b8-1a4de5903224';

// This setup is for opening a new tab in an already opened browser and use already existing metamask extension
// async function main() {
//   try {
//     const browser = await puppeteer.connect({
//       browserWSEndpoint: wsChromeEndpointurl,
//       slowMo: 150, // slow down by 250ms
//     });
//     const page = await browser.newPage();
//     await page.goto('http://localhost:3000/home?&chainId=5', {
//       waitUntil: 'networkidle0',
//     });

//     const metamask = await dappeteer.getMetamask(page);
//     await createQuest({ page, metamask, browser });
//   } catch (error) {
//     console.error(error);
//   }
// }

// This setup is for opening a new browser and importing the metamask extension as well as the test account
async function main() {
  if (!process.env.E2E_SECRET_WORDS) {
    throw new Error('E2E_SECRET_WORDS not set in .env file');
  }
  const [metamask, page, browser] = await dappeteer.bootstrap(puppeteer, {
    metamaskVersion: 'v10.15.0',
    seed: process.env.E2E_SECRET_WORDS,
    password: '12345678',
    showTestNets: true,
  });
  await page.goto('https://quests-55n3stz76-1hive.vercel.app/home?&chainId=5');
  await metamask.switchNetwork('goerli');
  await page.bringToFront();
  const accountButton = await page.waitForSelector('#account-button');
  await accountButton?.click();
  const metamaskButton = await page.waitForSelector('#injected');
  await metamaskButton?.click();
  await sleep(1000);
  await metamask.approve();
  await sleep(1000);
  await page.bringToFront();

  await createQuest({ page, metamask, browser });
}

async function createQuest({ page, metamask, browser }) {
  try {
    await page.evaluate(`
    localStorage.setItem('FLAG.GOERLI.DUMMY_QUEST', true);
    window.location.reload();
  `);
    await sleep(2000);
    await waitForTestIdAndClick(page, 'open-create-quest-btn');
    const questTitle = await page.$eval('#title', (element) => element.value);
    await waitForTestIdAndClick(page, 'next-step-btn');
    await page.evaluate(`
         document.querySelector('#bounty-wrapper input')?.focus();
         document.dispatchEvent(new FocusEvent('focusin'));
     `);
    await sleep(200);
    await waitForSelectorAndClick(page, '#bounty-wrapper li button');
    await fillInputBySelector(page, '#amount-bounty', '1');
    await waitForTestIdAndClick(page, 'complete-create-quest-btn');
    await approveTransaction({ page, metamask });
    await approveTransaction({ page, metamask });
    await waitForSelectorAndClick(page, '[title="Close"]');
    await expectTextExistsInPage(page, questTitle);
  } catch (error) {
    console.error(error);
    throw new Error('❌ Failed to create quest');
  }
  console.log('✅ Quest created');
}

main();
