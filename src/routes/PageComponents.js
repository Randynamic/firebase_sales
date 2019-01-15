import Loadable from "react-loadable";

export const Homepage = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "../pages/Homepage/HomePage"),
  loading: () => null,
  modules: ["homepage"]
});

export const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ "../pages/Login/Login"),
  loading: () => null,
  modules: ["login"]
});

export const Logout = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ "../pages/Login/Logout"),
  loading: () => null,
  modules: ["logout"]
});

export const Dashboard = Loadable({
  loader: () => import(/* webpackChunkName: "dashboard" */ "../pages/Dashboard/Main"),
  loading: () => null,
  modules: ["dashboard"]
});
