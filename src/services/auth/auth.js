import { pipe } from "../../utils/utils";
export * from "./sessions";

import {
  /**
   * ACTION CONSTANTS
   * AUTH
   */
  GET_TOKEN,
  AUTH_GET_SESSION,
  AUTH_SESSION_OK,
  AUTH_SESSION_FAILED,
  AUTH_LOGOUT,
  AUTH_DEFAULT
} from "../../store/constants";

import AUTHFLOW from "../../store/reducers/auth/flow";

import { checkSession, getToken } from "./sessions";

/**
 * @description Performs a serie of actions to authenticate session.
 * @returns {function} Dispatch function
 * @returns {object} Authentication results
 */
export const authenticateSession = () => async dispatch => {
  const authArgs = [{ session: null }];
  return await pipe(
    AUTHFLOW[AUTH_GET_SESSION].handler,
    AUTHFLOW[GET_TOKEN].handler
  )(...authArgs).then(result => handleAuthFlow(dispatch, result));
};

/**
 * @description Handles the response recieved from authenticateSession(). Decides/dispatches the auth action to take or fallback to default action.
 * @param {function} dispatch
 * @param {object} result Authentication Data
 */
export const handleAuthFlow = (dispatch, result) => {
  let [authData] = result;
  let action = "",
    actionArgs = [dispatch];
  if (authData && authData.token) {
    action = AUTH_SESSION_OK;
    actionArgs.push(authData);
  } else {
    action = AUTH_DEFAULT;
    actionArgs.push({ redirect: true, authData });
  }
  (AUTHFLOW[action] || AUTHFLOW[AUTH_DEFAULT]).dispatcher(...actionArgs);
  return authData;
};

/**
 * @description Authentication trigger to check session and get token if unauthenticated
 * @param {string} username Account username
 * @param {string} password Account password
 */
export const loginUser = (username, password) => async dispatch => {
  const currentSession = checkSession();
  if (currentSession && currentSession.token) {
    AUTHFLOW[AUTH_SESSION_OK].dispatcher(dispatch, currentSession);
    return currentSession;
  }
  const response = await getToken(username, password).catch(e => e);
  if (response && !response.ok) {
    AUTHFLOW[AUTH_SESSION_FAILED].dispatcher(dispatch);
  } else {
    AUTHFLOW[AUTH_SESSION_OK].dispatcher(dispatch, response);
  }
  return response;
};

/**
 * @description Dispatched logout
 */
export const logoutUser = () => dispatch => {
  AUTHFLOW[AUTH_LOGOUT].dispatcher(dispatch);
};
