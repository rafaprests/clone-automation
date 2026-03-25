const { chromium } = require('playwright');

async function launchBrowser() {
  return await chromium.launch({
    headless: false // deixa visível no começo pra debug
  });
}

module.exports = { launchBrowser };