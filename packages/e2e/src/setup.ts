import * as dappeteer from '@chainsafe/dappeteer';
import * as puppeteer from 'puppeteer';
import { MAX_TRIES } from './constant';
import { createQuest } from './create-quest';
import { connectWithMetamask } from './utils';

// This setup is for opening a new browser and importing the metamask extension as well as the test account
export async function setup(tries = MAX_TRIES) {
  if (!process.env.E2E_DEPLOYMENT_URL_BASE) {
    throw new Error('E2E_DEPLOYMENT_URL not set in env variables');
  }
  if (!process.env.E2E_SECRET_WORDS) {
    throw new Error('E2E_SECRET_WORDS not set in env variables');
  }
  let page: puppeteer.Page;
  let browser: puppeteer.Browser;
  try {
    console.info('🚀 Starting browser');
    const [metamask, _page, _browser] = await dappeteer.bootstrap(puppeteer, {
      metamaskVersion: 'v10.15.0',
      seed: process.env.E2E_SECRET_WORDS,
      password: '12345678',
      showTestNets: true,
      headless: false,
      args: [`--no-sandbox`, `--disable-setuid-sandbox`],
    });
    browser = _browser;
    page = _page;
    console.info('Broser launched & Metamask imported');
    const pageUrl = `${process.env.E2E_DEPLOYMENT_URL_BASE}/home?&chainId=5`;
    console.log(`Opening page ${pageUrl} ...`);
    await page.goto(pageUrl);
    console.info(`Page loaded`);
    await metamask.switchNetwork('goerli');
    console.info('Switched to Goerli');

    try {
      connectWithMetamask({ page, metamask });
    } catch (error) {
      console.error('Fail to connect with metamask, retrying...', error);
      connectWithMetamask({ page, metamask });
    }

    await createQuest({ page, metamask, browser });
    await browser.close();
  } catch (error) {
    if (page) {
      await page.screenshot({
        path: `screenshots/e2e_try_n${tries}.png`,
        fullPage: true,
      });
    }
    console.error(`Try #${MAX_TRIES - tries + 1} failed : `, error);
    if (tries > 0) {
      console.log(`Retrying...`);
      await browser?.close();
      setup(tries - 1);
    } else {
      throw error; // Rethrow error
    }
  }
}
