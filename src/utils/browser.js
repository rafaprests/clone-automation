const { firefox } = require('playwright');

async function launchBrowser() {
  return await firefox.launch({
    headless: false // deixa visível no começo pra debug
  });
}

module.exports = { launchBrowser };