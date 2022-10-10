require('dotenv').config();

module.exports = async () => {
  if (!process.env.E2E_KEEP_BROWSER_OPEN) {
    await global.browser.close();
  }
};
