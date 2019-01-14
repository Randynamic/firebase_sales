import Cookies from "js-cookie";

import stub from "../mock/factories/users";
import API from "../../utils/effects";

/**
 *
 *
 *
 *
 * MIDDLEWARE FUNCTIONS
 *
 *
 *
 *
 *
 */

/**
 * @description Get local passed or locally stored session data
 * @param {currentUser} session Retrieved user session data
 */
export const getSession = async session => {
  let authSession = session || (await Cookies.getJSON(process.env.COOKIE_SESSION));
  if (authSession) {
    return authSession;
  }
  return null;
};
export const getSessionSync = session => {
  let authSession = session || Cookies.getJSON(process.env.COOKIE_SESSION);
  if (authSession) {
    return authSession;
  }
  return null;
};

/**
 * @description Promise to check if session is valid else remove session and return null
 */
export const checkSession = async () => {
  const session = await getSession();
  if (session && session.token) {
    return session;
  }
  return null;
};

/**
 * @description Validate Session
 */
export const validateSession = session => {
  if (session && session.token) {
    return true;
  }
  return false;
};

/**
 * @description Save retrieved session locally for process.env.COOKIE_AUTH_SESSION_TTL days
 * @param {currentUser} session Retrieved user session data
 */
export const saveSession = async sessionData => {
  const localSession = await getSession();
  if (!localSession) {
    Cookies.set(process.env.COOKIE_SESSION, sessionData, {
      expires: +process.env.COOKIE_AUTH_SESSION_TTL,
      domain: process.env.COOKIE_AUTH_SESSION_DOMAIN
    });
  }
};

/**
 * @description Remove locally stored session data
 */
export const removeSession = () => {
  Cookies.remove(process.env.COOKIE_SESSION);
};

/**
 *
 *
 *
 *
 * END MIDDLEWARE FUNCTIONS
 *
 *
 *
 *
 *
 */

/**
 * @description Post user credentials and retrieve a token if valid else response error feedback
 * @param {string} username Account username
 * @param {string} password Account password
 */
export const getToken = async (username, password) => {
  if (process.env.MOCK_DATA) {
    return await stub(username, password);
  }
  return API.post(`/auth/getToken`, {
    body: {
      username,
      password
    }
  })
    .then(result => {
      if (result.data && result.data.ok) {
        return result.data;
      }
      return result;
    })
    .catch(e => e);
};
