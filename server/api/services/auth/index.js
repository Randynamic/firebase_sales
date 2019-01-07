const msAuthHelper = require("./ms-helpers");
const slackAuthHelper = require("./slack-helper");

module.exports = {
  getToken: async (code, app, res) => {
    switch (app) {
      case "ms":
        if (code) {
          let session;
          try {
            session = await msAuthHelper.getTokenFromCode(code, res);
            return {
              ok: true,
              app: app,
              data: session
            };
          } catch (error) {
            throw "Error exchanging code for token";
          }
        }
        return null;
      case "slack":
      default:
        if (code) {
          let session;
          try {
            session = await slackAuthHelper.getTokenFromCode(code, res);
            return {
              ok: true,
              app: app,
              ...session
            };
          } catch (error) {
            throw "Error exchanging code for token";
          }
        }
        throw "Missing code parameter";
    }
  }
};
