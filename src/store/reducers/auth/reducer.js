import AUTHFLOW from "./flow";

import { AUTH_DEFAULT } from "../../constants";

const initialState = {
  isAuthenticated: false,
  redirect: true,
  currentUser: {}
};

export default (state = initialState, action) => (AUTHFLOW[action.type] || AUTHFLOW[AUTH_DEFAULT]).reducer(state, action);
