import Loadable from "react-loadable";

export const Homepage = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "../pages/Homepage/HomePage"),
  loading: () => null,
  modules: ["homepage"]
});

export const AboutUs = Loadable({
  loader: () => import(/* webpackChunkName: "about-us" */ "../pages/Content/AboutUs"),
  loading: () => null,
  modules: ["aboutUs"]
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

export const MyAccount = Loadable({
  loader: () => import(/* webpackChunkName: "dashboard" */ "../pages/MyAccount/MyAccount"),
  loading: () => null,
  modules: ["myAccount"]
});
