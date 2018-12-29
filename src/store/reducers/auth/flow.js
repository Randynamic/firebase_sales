import {
  /**
   * ACTION CONSTANTS
   * AUTH
   */
  SET_CURRENT_USER,
  GET_TOKEN,
  AUTH_SESSION_OK,
  AUTH_SESSION_FAILED,
  AUTH_RESTRICTED_ACCESS,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_GET_SESSION,
  AUTH_CLEAR_SESSION
} from "../../constants";

import { getSession, saveSession, removeSession } from "../../../services/auth/auth";

/**
 *
 * AUTHORIZATION FLOW
 *
 * @handler -> prepares the action
 * @dispatcher -> triggers the reducer
 * @reducer -> sets the state
 *
 */

export default {
  [AUTH_GET_SESSION]: {
    handler: async (...args) => {
      let [authData, ...otherArgs] = args;
      authData = await getSession(authData.session);
      return [authData, ...otherArgs];
    },
    reducer: (state, value) => {
      return {
        ...state,
        value
      };
    }
  },
  [SET_CURRENT_USER]: {
    sideEffects: async session => {
      saveSession(session);
      return true;
    },
    dispatcher: (dispatch, { session }) => {
      dispatch({ type: SET_CURRENT_USER, session });
    },
    reducer: (state, { session }) => {
      return {
        ...state,
        isAuthenticated: session && session.token ? true : false,
        currentUser: session,
        redirect: true
      };
    }
  },
  [AUTH_CLEAR_SESSION]: {
    reducer: ({ currentUser, ...state }) => {
      return {
        ...state,
        isAuthenticated: false,
        redirect: true
      };
    }
  },
  [AUTH_SESSION_OK]: {
    sideEffects: async ({ session }) => {
      const storedSession = await getSession();
      if (!storedSession && session && session.token) {
        saveSession(session);
      } else if (!session) {
        throw "ERROR INVALID AUTH";
      }
    },
    dispatcher: (dispatch, session) => {
      dispatch({
        type: AUTH_SESSION_OK,
        session
      });
    },
    reducer: (state, { session }) => {
      return {
        ...state,
        isAuthenticated: true,
        currentUser: session,
        redirect: false
      };
    }
  },
  [AUTH_SESSION_FAILED]: {
    dispatcher: dispatch => dispatch,
    reducer: state => {
      return {
        ...state,
        currentUser: {},
        isAuthenticated: false,
        redirect: true
      };
    }
  },
  [AUTH_RESTRICTED_ACCESS]: {
    reducer: (state, { redirect }) => {
      return {
        ...state,
        isAuthenticated: false,
        currentUser: {},
        redirect: redirect
      };
    }
  },
  [GET_TOKEN]: {
    handler: async (...args) => {
      let [authData, ...rest] = args;
      if (authData && authData.token) {
        return [authData, ...rest];
      } else {
        return [...rest];
      }
    },
    sideEffects: async () => {
      const session = await getSession();
      return session;
    },
    dispatcher: (dispatch, session) => {
      if (!session) {
        dispatch({ type: SET_CURRENT_USER, value: session });
      }
    },
    reducer: state => {
      return {
        ...state
      };
    }
  },
  [AUTH_LOGIN]: {
    sideEffects: async ({ session }, state) => session,
    dispatcher: (dispatch, { redirect, ...rest }) => {
      dispatch({ type: AUTH_LOGIN, redirect: true, ...rest });
    },
    reducer: (state, { type, ...value }) => {
      return { ...state, ...value };
    }
  },
  [AUTH_LOGOUT]: {
    sideEffects: async () => {
      return removeSession();
    },
    dispatcher: dispatch => {
      dispatch({ type: AUTH_CLEAR_SESSION, isAuthenticated: false, currentUser: {} });
      dispatch({
        type: AUTH_LOGOUT
      });
    },
    reducer: ({ currentUser, ...state }) => {
      return {
        ...state,
        isAuthenticated: false,
        redirect: true
      };
    }
  }
};
