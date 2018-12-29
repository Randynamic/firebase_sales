import React from "react";
import { render, hydrate } from "react-dom";
import { Router } from "react-router-dom";
import App from "./containers/App/App";

import Loadable from "react-loadable";
import { Provider } from "react-redux";
import createStore from "./store/config";
import { createHistory } from "./utils/middlewares";

import "./styles/global.scss";

const store = createStore();
const history = createHistory();

const Application = (
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
);

const root = document.querySelector("#root");

if (root && root.hasChildNodes() === true) {
  Loadable.preloadReady().then(() => {
    hydrate(Application, root);
  });
} else {
  render(Application, root);
}

if (module.hot) {
  module.hot.accept("./store/reducers", () => {
    const nextRootReducer = require("./store/reducers/index");
    store.replaceReducer(nextRootReducer);
  });
}
