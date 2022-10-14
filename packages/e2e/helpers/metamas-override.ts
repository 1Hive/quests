import { sleep } from './utils';

export async function confirmTransaction() {
  console.log('Confirming transaction...');
  const metamaskPage = await browser.newPage();
  console.log('Metamask loaded');
  await metamaskPage.goto(
    'chrome-extension://nloekkhijkhcemdonjgjhpfckgnbegln/home.html#',
  );
  console.log('Metamask page brought to front');
  await sleep(10000); // Wait for page to load and gas suggestion to be fetched
  console.log('Metamask page loaded');
  (await metamaskPage.waitForSelector('.btn-primary:not([disabled])')).click();
  console.log('Metamask confirm button clicked');
  await sleep(500);
  console.log('Slept 500 ms');
  await page.bringToFront();
  console.log('Quests page brought to front');
}
