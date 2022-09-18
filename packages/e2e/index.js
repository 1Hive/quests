// @ts-nocheck
const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} xpath
 * @param {puppeteer.Page} page
 */
function findByText(xpath, page) {
  return page.waitForXPath(xpath);
}

async function main() {
  //   if (!process.env.E2E_SECRET_WORDS) {
  //     throw new Error('E2E_SECRET_WORDS not set in .env file');
  //   }
  const [metamask, page, browser] = await dappeteer.bootstrap(puppeteer, {
    metamaskVersion: 'v10.15.0',
    seed: 'universe scan frog injury army key amazing cycle garden water space machine', // process.env.E2E_SECRET_WORDS,
    password: '12345678',
    showTestNets: true,
  });
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  await page.goto('http://localhost:3000/home?chainId=5');
  await metamask.switchNetwork('goerli');
  await page.bringToFront();
  const accountButton = await page.waitForSelector('#account-button');
  await accountButton.click();
  const metamaskButton = await page.waitForSelector('#injected');
  await metamaskButton.click();
  await metamask.approve();
  await page.bringToFront();
}

main();
