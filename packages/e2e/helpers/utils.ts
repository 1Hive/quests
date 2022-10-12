import { config } from 'dotenv';
import { WaitForSelectorOptions } from 'puppeteer';

config();

jest.retryTimes(
  process.env.E2E_RETRY_TIMES ? parseInt(process.env.E2E_RETRY_TIMES, 10) : 1,
);

export async function gotoApp(chainId?: string) {
  return page.goto(
    `${process.env.E2E_DEPLOYMENT_URL_BASE}/chainId=${
      chainId ?? process.env.E2E_CHAIN_ID ?? ''
    }`,
  );
}

export async function connectWithMetamask() {
  try {
    await metamask.switchNetwork('goerli');
    await page.bringToFront();
    console.info('Page brought to front');
    await waitForSelectorAndClick('#account-button', {
      timeout: 5000,
    });
    console.info('Account button clicked');
    await waitForSelectorAndClick('#injected');
    console.info('Metamask button clicked');
    await sleep(2000);
    console.info('Slept 2 sec');
    await Promise.race([metamask.approve(), sleep(5000)]); // Wait for max 5 seconds
    console.info('Metamask approved');
    await sleep(2000);
    console.info('Slept 2 sec');
  } catch (error) {
    // Skip if already connected
    console.warn(error);
  }
  await page.bringToFront();
  console.info('Page brought to front');
}

export async function waitForSelectorAndClick(
  cssSelector: string,
  options?: WaitForSelectorOptions & { waitForNavigation?: boolean },
) {
  const elementToClick = await page.waitForSelector(cssSelector, options);
  if (!elementToClick) {
    throw new Error(`Element not found with: ${cssSelector}`);
  }
  await elementToClick.click();
  await sleep(500);
}

export async function waitForSelectorAndEval<TResult = any>(
  cssSelector: string,
  evalFunction: (element: Element) => TResult,
  options?: WaitForSelectorOptions & { waitForNavigation?: boolean },
) {
  const elementToClick = await page.waitForSelector(cssSelector, options);
  if (!elementToClick) {
    throw new Error(`Element not found with: ${cssSelector}`);
  }
  return page.$eval(cssSelector, evalFunction);
}

export async function sleep(timeout: number) {
  return new Promise((res) => setTimeout(res, timeout));
}

export async function executeTransaction() {
  console.info('Executing transaction...');
  await page.waitForSelector('.TX_WAITING_FOR_SIGNATURE');
  await sleep(5000);
  try {
    await metamask.confirmTransaction();
  } catch (error) {
    console.warn('Metamask confirm transaction failed, retrying...', error);
    try {
      await metamask.confirmTransaction();
    } catch (err) {
      console.error(err);
      throw new Error('Metamask confirm transaction failed');
    }
  }
  await page.bringToFront();
  try {
    await page.waitForSelector('.TX_STATUS_CONFIRMED', {
      timeout: 600000, // 10 minutes
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      'The transaction timed out before reaching the state confirmed',
    );
  }
}

export async function expectTextExistsInPage(text: string, timeout = 2000) {
  const xp = `//*[contains(text(),'${text}')]`;
  try {
    console.info(`Looking for text "${text}" ...`);
    await page.waitForXPath(xp, {
      timeout,
    });
    console.info(`Text found: "${text}"`);
  } catch (error) {
    if (error) console.error(error);
    throw new Error(`Text not found: "${text}"`);
  }
}

export async function fillInputBySelector(selector: string, value: string) {
  await page.type(selector, value);
}

/**
 * Need to set {devtools: true} in jest-puppeteer.config.js
 * @returns
 */
export function debug() {
  return page.evaluate(() => {
    debugger;
  });
}
