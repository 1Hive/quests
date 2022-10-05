const { RECOMMENDED_METAMASK_VERSION } = require('@chainsafe/dappeteer');

const config = {
  dappeteer: {
    metamaskVersion: RECOMMENDED_METAMASK_VERSION,
    args: [`--no-sandbox`, `--disable-setuid-sandbox`],
  },
  metamask: {
    seed: 'universe scan frog injury army key amazing cycle garden water space machine',
    password: 'password1234',
    showTestNets: true,
  },
};

module.exports = config;
