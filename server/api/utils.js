const path = require("path");

module.exports = {
  wrap: fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
  delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
  dir: fileName => path.resolve(__dirname, fileName),
  guid: size => {
    function chr4() {
      return (
        Date.now().toString(36) +
        Math.random()
          .toString(16)
          .slice(-4)
      );
    }
    const guid = chr4() + chr4() + "-" + chr4() + "-" + chr4() + "-" + chr4() + "-" + chr4() + chr4() + chr4();
    return guid.substr(0, size || guid.length);
  }
};
