import AUTHFLOW from "./flow";

import { getSessionSync } from "../../../services/auth/sessions";

import { AUTH_DEFAULT } from "../../constants";

const storedSession = getSessionSync();

const initialState = {
  isAuthenticated: storedSession && storedSession.ok ? true : false,
  redirect: true,
  currentUser: storedSession || {}
};

export default (state = initialState, action) => (AUTHFLOW[action.type] || AUTHFLOW[AUTH_DEFAULT]).reducer(state, action);
