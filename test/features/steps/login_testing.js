const Mock = require("../utils/stubs");
const utils = require("../utils");
const assert = require("assert");
const { Before, After, Given, When, Then } = require("cucumber");

const mock = new Mock();

const config = {
  module: "login",
  makeScreenshots: false,
  visitUrl: "http://localhost:8080/login",
  loginTitle: "Login",
  loginUsernameInput: "#username",
  loginPasswordInput: "#password",
  loginBtn: "#loginBtn",
  root: "#root",
  endpoints: {
    getToken: {
      method: "get",
      url: "http://localhost:8080/getToken",
      status: 200,
      headers: { "Content-Type": "application/json" },
      payload: { token: 123456789 },
      expected: { token: 123456789 }
    }
  }
};

Before(() => {
  mock.init();
});

Given(/^I am on the login page$/, () => {
  browser.url(config.visitUrl);
  browser.getTitle().should.equal(config.loginTitle);
  if (config.makeScreenshots) {
    utils.makeScreenshot(config.module);
  }
});

When(/^I enter "([^"]*)" into the username input$/, username => {
  const usernameInput = config.loginUsernameInput;
  browser.click(usernameInput);
  browser.clearElement(usernameInput);
  browser.setValue(usernameInput, username);
  browser.getValue(usernameInput).should.equal(username);

  browser.pause(500);
});

When(/^I enter "([^"]*)" into the password input$/, password => {
  const passwordInput = config.loginPasswordInput;
  browser.click(passwordInput);
  browser.clearElement(passwordInput);
  browser.setValue(passwordInput, password);
  browser.getValue(passwordInput).should.equal(password);
  browser.pause(500);
});

When(/^Retrieve the token$/, async () => {
  browser.click(config.loginBtn);
  /**
   * Mock API Response getToken => resolved
   */
  const { expected } = config.endpoints.getToken;
  mock.setResolvedState(config.endpoints.getToken).then(result => {
    assert.deepEqual(result, expected);
  });
});

Then(/^I should see the dashboard page$/, () => {
  browser.pause(2000);
  browser.waitForVisible(config.root);
  return browser.isVisible(config.root).should.be.true;
});

After(() => {
  mock.close();
});
