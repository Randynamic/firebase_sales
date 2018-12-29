const sinon = require("sinon");
const axios = require("axios");

module.exports = function() {
  this.sandbox = null;
  this.init = function() {
    this.sandbox = sinon.createSandbox();
  };
  this.close = function() {
    this.sandbox.restore();
  };
  this.setResolvedState = async function(config) {
    const resolved = new Promise(resolve => resolve(config.payload));
    this.sandbox.stub(axios, config.method).returns(resolved);
    return await this.fetch(config.url).catch(e => e);
  };
  this.setRejectedState = function(config) {
    const rejected = new Promise((_, rejected) => rejected(config.error));
    this.sandbox.stub(axios, config.method).returns(rejected);
  };
  this.fetch = function(url) {
    return axios
      .get(url)
      .catch(err => err)
      .then(results => results);
  };
};
