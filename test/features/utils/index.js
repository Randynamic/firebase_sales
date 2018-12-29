const fs = require("fs");

module.exports = {
  makeScreenshot: section => {
    const screenshot = browser.saveScreenshot();
    fs.writeFileSync(`./test/screenshots/${section}.png`, screenshot);
  }
};
