import { Page } from 'puppeteer';

export async function connectWithMetamask({ page, metamask }) {
  await page.bringToFront();
  console.info('Page brought to front');
  const accountButton = await page.waitForSelector('#account-button');
  console.info('Account button found');
  await accountButton?.click();
  console.info(' Account button clicked');
  const metamaskButton = await page.waitForSelector('#injected');
  console.info('Metamask button found');
  await metamaskButton?.click();
  console.info('Metamask button clicked');
  console.info('Sleeping 2s...');
  await sleep(2000);
  await metamask.approve();
  console.info('Metamask approved');
  console.info('Sleeping 2s...');
  await sleep(2000);
  await page.bringToFront();
  console.info('Page brought to front');
}

export async function waitForSelectorAndClick(
  page: Page,
  queryOverride: string,
) {
  const elementToClick = await page.waitForSelector(queryOverride);
  await elementToClick.click();
}

export async function waitForTestIdAndClick(page: Page, testid: string) {
  const elementToClick = await page.waitForSelector(
    `[data-testid="${testid}"]`,
  );
  await elementToClick.click();
}

export async function sleep(timeout: number) {
  return new Promise((res) => setTimeout(res, timeout));
}

export async function executeTransaction({ page, metamask }) {
  await page.waitForSelector('[data-testid="TX_WAITING_FOR_SIGNATURE"]');
  await sleep(5000);
  await metamask.confirmTransaction();
  await page.bringToFront();
  await page.waitForSelector('[data-testid="TX_STATUS_CONFIRMED"]', {
    timeout: 120000,
  });
}

export async function expectTextExistsInPage(
  page: Page,
  text: string,
  timeout = 2000,
) {
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

export function fillInputBySelector(
  page: Page,
  selector: string,
  value: string,
) {
  return page.$eval(
    selector,
    (el: HTMLInputElement, _value: any) => {
      el.value = _value;
      el.dispatchEvent(new Event('change'));
    },
    value,
  );
}
