import AUTHFLOW from "../store/reducers/auth/flow";
import { AUTH_SESSION_OK } from "../store/constants/auth";

export default store => next => action => {
  const state = store.getState();
  if (typeof AUTHFLOW[action.type].sideEffects === "function") {
    if (
      // skip if already is authorized
      state &&
      state.auth &&
      state.auth.isAuthenticated &&
      action.type === AUTH_SESSION_OK
    ) {
      return next(action);
    }
    return AUTHFLOW[action.type]
      .sideEffects(action, state)
      .then(result => next({ ...action, result }))
      .catch(error => {
        next({ ...action, error });
      });
  }
  return next(action);
};
