import { createStore } from "redux";
import { connectRouter } from "connected-react-router";
import rootReducer from "./rootReducers";

import { isServer, composedEnhancers, createHistory } from "../utils/middlewares";

export default () => {
  const initialState = !isServer ? window.__PRELOADED_STATE__ : {};
  const history = createHistory();
  return createStore(connectRouter(history)(rootReducer), initialState, composedEnhancers);
};
