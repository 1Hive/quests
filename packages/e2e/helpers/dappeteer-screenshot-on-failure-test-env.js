/* eslint-disable no-useless-constructor */
const { getMetamaskWindow } = require('@chainsafe/dappeteer');
const NodeEnvironment = require('jest-environment-node').default;
const puppeteer = require('puppeteer');
const fs = require('fs');

class DappeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();

    // get the wsEndpoint
    const wsEndpoint = process.env.PUPPETEER_WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    // connect to puppeteer
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
    this.global.browser = browser;
    this.global.metamask = await getMetamaskWindow(browser);
    this.global.page = await browser.newPage();
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_fn_failure') {
      const dir = './screenshots';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      this.global.page.screenshot({
        path: `${dir}/${state.currentlyRunningTest.name.replace(
          ' ',
          '-',
        )}-${new Date()
          .toLocaleTimeString('fr')
          .substring(0, 5)
          .replace(':', 'h')}.png`,
        type: 'png',
        fullPage: true,
      });
    }
  }
}

module.exports = DappeteerEnvironment;
