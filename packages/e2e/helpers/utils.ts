import { config } from 'dotenv';
import { ElementHandle, Page, WaitForSelectorOptions } from 'puppeteer';
import {
  confirmTransaction,
  disconnectAccountInMetamask,
  getMetamaskPage,
} from './metamask-override';

config();

jest.retryTimes(
  process.env.E2E_RETRY_TIMES === undefined
    ? 0
    : parseInt(process.env.E2E_RETRY_TIMES, 10),
);

export async function gotoApp(chainId?: string) {
  return page.goto(
    `${process.env.E2E_DEPLOYMENT_URL_BASE}/chainId=${
      chainId ?? process.env.E2E_CHAIN_ID ?? ''
    }`,
  );
}

export async function connectWithMetamask(secondAccount?: boolean) {
  try {
    if (!secondAccount) {
      await metamask.switchNetwork('goerli');
      console.info('Network switched');
    }
    await page.bringToFront();
    console.info('Page brought to front');
    try {
      await waitForSelectorAndClick('#account-button', {
        timeout: 2000,
      });
      console.info('Account button clicked');
      await waitForSelectorAndClick('#injected');
      console.info('Metamask button clicked');
    } catch (error) {
      console.warn('Already connected', error);
    }
    await sleep(2000);
    console.info('Slept 2 sec');
    if (secondAccount) {
      console.log('Second account');
      const metamaskPage = await getMetamaskPage();
      await waitForElementByTextAndClick('Next', metamaskPage);
      await waitForElementByTextAndClick('Connect', metamaskPage);
    } else {
      await Promise.race([metamask.approve(), sleep(5000)]); // Wait for max 5 seconds
    }
    await metamask.approve();
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

export async function importAndSwitchOtherAccount() {
  try {
    try {
      await disconnectAccountInMetamask();
    } catch (error) {
      console.warn('Already disconnected', error);
    }
    await Promise.race([
      metamask.importPK(
        '123cd73e0313b8253b913310b047858403f11e3f0837431acf5a2dfdb2166cd0',
      ),
      sleep(3000),
    ]);
    console.info('2nd account imported');
    await metamask.switchAccount(2);
    console.info('Account switched');
  } catch (error) {
    // Skip if already connected
    console.warn(error);
  }
  await page.bringToFront();
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
  await page.waitForSelector('.TX_WAITING_FOR_SIGNATURE');
  let timeout = 5000; // 5 seconds
  await sleep(timeout); // Wait for gas suggestion to be fetched
  try {
    await metamask.confirmTransaction();
  } catch (error) {
    console.warn(
      `Timeout: Metamask confirm transaction failed, retrying...`,
      error.message || error,
    );
    try {
      await page.bringToFront();
      await confirmTransaction();
    } catch (err) {
      console.error(err);
      throw new Error('Metamask confirm transaction failed.');
    }
  }
  console.info('Executing transaction...');
  await page.bringToFront();
  timeout = 300000; // 10 minutes
  try {
    await page.waitForSelector('.TX_STATUS_CONFIRMED', {
      timeout,
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Timeout ${timeout}ms: Failed to complete transaction.`);
  }
}

export async function waitForElementByTextAndClick(
  text: string,
  _page?: Page,
  timeout = 2000,
) {
  _page = _page ?? page;
  const element = (await page.waitForXPath(`//*[contains(text(),'${text}')]`, {
    timeout,
  })) as ElementHandle<HTMLElement>;
  element.click();
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
    throw new Error(`Timeout ${timeout}ms: Text not found: "${text}"`);
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

// async function confirmTransactionForce() {
//   const newPage = await browser.newPage();
//   await page.goto(
//     'chrome-extension://nloekkhijkhcemdonjgjhpfckgnbegln/home.html', // Open metamask in a new tab
//   );
//   await sleep(3000);
//   await Promise.race([metamask.confirmTransaction(), sleep(5000)]); // Wait for max 5 seconds
//   await page.bringToFront();
// }
