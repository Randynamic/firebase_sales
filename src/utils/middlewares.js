import { applyMiddleware, compose } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { createBrowserHistory, createMemoryHistory } from "history";

import flowMiddleware from "../store/middleware";

// @TODO Create dispatcher middleware

export const isServer = !(typeof window !== "undefined" && window.document && window.document.createElement);

const enhancers = [];

if (process.env.NODE_ENV === "development" && !isServer) {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const middleware = [thunk, routerMiddleware(history)];
export const composedEnhancers = compose(
  applyMiddleware(...middleware),
  applyMiddleware(flowMiddleware),
  ...enhancers
);

export const createHistory = (url = "/") => {
  const history = isServer ? createMemoryHistory({ initialEntries: [url] }) : createBrowserHistory();

  if (!isServer) {
    delete window.__PRELOADED_STATE__;
  }

  return history;
};
