import React from "react";
import { Switch, Redirect } from "react-router-dom";

/**
 * Loadeable Components
 */
import { Homepage, AboutUs, Login, Logout, Dashboard, MyAccount } from "./PageComponents";
import { NotFound } from "../pages/Common/NotFound";

/**
 * Custom Route Components
 */
import ContextRoute from "../containers/RouteContainers/ContextRoute";
import UnauthenticatedRoute from "../containers/RouteContainers/UnauthenticatedRoute";
import AuthenticatedRoute from "../containers/RouteContainers/AuthenticatedRoute";

/**
 * @description Component to redirect rejected states
 * @param {object} props
 */
export const Reject = ({ to }) => {
  return <Redirect to={to} />;
};

/**
 * Router Switch Application Wide
 */
export const RouterComponent = props => (
  <Switch>
    <ContextRoute exact path="/" component={Homepage} />
    <ContextRoute exact path="/about-us" component={AboutUs} />
    <UnauthenticatedRoute exact path="/login" component={Login} />
    <UnauthenticatedRoute exact path="/logout" component={Logout} />
    <AuthenticatedRoute exact path="/dashboard" component={Dashboard} />
    <AuthenticatedRoute exact path="/my-account" component={MyAccount} />
    <ContextRoute component={NotFound} />
  </Switch>
);

export default RouterComponent;
