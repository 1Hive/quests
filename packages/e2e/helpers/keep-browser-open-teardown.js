require('dotenv').config();

module.exports = async () => {
  if (
    !process.env.E2E_KEEP_BROWSER_OPEN ||
    process.env.E2E_KEEP_BROWSER_OPEN === 'false'
  ) {
    await global.browser.close();
  }
};
