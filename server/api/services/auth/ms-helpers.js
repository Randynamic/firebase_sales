const config = {
  redirect_url: process.env.REDIRECT_URL + "/ms",
  client_id: process.env.CREDS_MS_ID,
  client_secret: process.env.CREDS_MS_SECRET,
  scope: "openid profile User.Read"
};

const credentials = {
  client: {
    id: config.client_id,
    secret: config.client_secret
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
    authorizePath: "common/oauth2/v2.0/authorize",
    tokenPath: "common/oauth2/v2.0/token"
  }
};
const oauth2 = require("simple-oauth2").create(credentials);
const jwt = require("jsonwebtoken");

function getAuthUrl() {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: config.redirect_url,
    scope: config.scope
  });
  return returnVal;
}

async function getTokenFromCode(auth_code, res) {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri: config.redirect_url,
    scope: config.scope
  });

  const token = oauth2.accessToken.create(result);

  saveValuesToCookie(token, res);

  return token.token;
}

async function getAccessToken(cookies, res) {
  let token = cookies.graph_access_token;

  if (token) {
    const FIVE_MINUTES = 300000;
    const expiration = new Date(
      parseFloat(cookies.graph_token_expires - FIVE_MINUTES)
    );
    if (expiration > new Date()) {
      return token;
    }
  }

  const refresh_token = cookies.graph_refresh_token;
  if (refresh_token) {
    const newToken = await oauth2.accessToken
      .create({ refresh_token: refresh_token })
      .refresh();
    saveValuesToCookie(newToken, res);
    return newToken.token.access_token;
  }

  return null;
}

function saveValuesToCookie(token, res) {
  const user = jwt.decode(token.token.id_token);
  res.cookie("graph_access_token", token.token.access_token, {
    maxAge: 3600000,
    httpOnly: true
  });
  res.cookie("graph_user_name", user.name, { maxAge: 3600000, httpOnly: true });
  res.cookie("graph_refresh_token", token.token.refresh_token, {
    maxAge: 7200000,
    httpOnly: true
  });
  res.cookie("graph_token_expires", token.token.expires_at.getTime(), {
    maxAge: 3600000,
    httpOnly: true
  });
}

function clearCookies(res) {
  res.clearCookie("graph_access_token", { maxAge: 3600000, httpOnly: true });
  res.clearCookie("graph_user_name", { maxAge: 3600000, httpOnly: true });
  res.clearCookie("graph_refresh_token", { maxAge: 7200000, httpOnly: true });
  res.clearCookie("graph_token_expires", { maxAge: 3600000, httpOnly: true });
}

exports.getAuthUrl = getAuthUrl;
exports.getTokenFromCode = getTokenFromCode;
exports.getAccessToken = getAccessToken;
exports.clearCookies = clearCookies;
