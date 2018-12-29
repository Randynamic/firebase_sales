import sinon from "sinon";
import axios from "axios";

/**
 * @description Mock data creation class
 */
export default class {
  sandbox = null;
  config = undefined;
  resolve = undefined;
  constructor(config) {
    if (config) {
      this.config = config;
    }
  }
  setMockState(data) {
    this.resolve = data;
  }
  async setResolvedState(config) {
    if (config) {
      this.config = config;
      this.resolve = new Promise(resolve => resolve(this.config.resolve));
    }
    this.resolve = new Promise(resolve => resolve(this.resolve));
    this.sandbox.stub(axios, "request").returns(this.resolve);
    return await this.fetch(this.config).catch(e => e);
  }
  async setRejectedState(config) {
    if (config) {
      this.config = config;
    }
    const rejected = new Promise((_, rejected) => rejected(this.config.error));
    this.sandbox.stub(axios, "request").returns(rejected);
    return rejected;
  }
  fetch({ ...args }) {
    return axios
      .request(args)
      .catch(err => err)
      .then(results => results);
  }
  init() {
    this.sandbox = sinon.createSandbox();
  }
  close() {
    this.sandbox.restore();
  }
}
