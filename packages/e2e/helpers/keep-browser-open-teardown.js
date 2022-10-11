require('dotenv').config();

module.exports = async () => {
  if (
    !process.env.E2E_KEEP_BROWSER_OPEN ||
    process.env.E2E_KEEP_BROWSER_OPEN === 'false'
  ) {
    await new Promise((res) => setTimeout(res, 1000)); // wait for the browser to close to let time screenshot to be taken
    await global.browser.close();
  }
};
