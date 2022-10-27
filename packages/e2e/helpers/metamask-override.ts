import { ElementHandle } from 'puppeteer';
import { sleep } from './utils';

export async function getMetamaskPage() {
  return (await browser.pages()).find(
    (x) => x.url().includes('chrome-extension'), // Trust its metamask
  );
}

export async function confirmTransaction() {
  const metamaskPage = await getMetamaskPage();
  metamaskPage.bringToFront();
  await sleep(10000); // Wait for page to load and gas suggestion to be fetched
  (await metamaskPage.waitForSelector('.btn-primary:not([disabled])')).click();
  await sleep(500);
  await page.bringToFront();
}

export async function disconnectAccountInMetamask() {
  const metamaskPage = await getMetamaskPage();
  await metamaskPage.bringToFront();
  (
    await metamaskPage.waitForSelector('button.menu-bar__account-options')
  ).click();
  await metamaskPage.bringToFront();
  await (
    await metamaskPage.waitForSelector(
      '[data-testid="account-options-menu__connected-sites"]',
    )
  ).click();
  await (
    (await metamaskPage.waitForXPath('//*[contains(text(),"Disconnect")]', {
      timeout: 1000, // 1 sec
    })) as ElementHandle<Element>
  ).click();
  await (
    (await metamaskPage.waitForSelector(
      '.connected-sites__footer-row .btn-primary',
      {
        timeout: 1000, // 1 sec
      },
    )) as ElementHandle<Element>
  ).click();
  await page.bringToFront();
}
