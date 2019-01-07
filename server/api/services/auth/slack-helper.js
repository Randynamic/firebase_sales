const axios = require("axios");

const config = {
  redirect_url: process.env.REDIRECT_URL + "/slack",
  client_id: process.env.CREDS_SLACK_ID,
  client_secret: process.env.CREDS_SLACK_SECRET,
  base_url: "https://slack.com/api"
};

module.exports = {
  getTokenFromCode: async (code, res) => {
    url = `${config.base_url}/oauth.access?client_id=${
      config.client_id
    }&client_secret=${config.client_secret}&code=${code}&redirect_uri=${
      config.redirect_url
    }`;
    const sessionData = await axios(url)
      .then(result => {
        const { ok, ...rest } = result.data;
        if (ok) {
          return rest;
        }
        return result;
      })
      .catch(e => {
        return (sessionData = { ok: false, error: e });
      });
    return sessionData;
  }
};
