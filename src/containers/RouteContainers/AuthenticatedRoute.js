import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { bindActionCreators } from "redux";

import { authenticateSession, validateSession } from "../../services/auth/auth";
import { AUTH_LANDING_ROUTE, URL_LOGOUT, URL_LOGIN, URL_PARAM_REDIRECT } from "../../store/constants";

import { PrivateConsumer } from "../Contexts/RootConsumer";

import { ProcessingAuth } from "../../components/Transitions/Auth";

import { Reject } from "../../routes/Routes";

/**
 *
 * @name AuthenticatedRoute
 *
 * Stateful Authenticated Route Component
 * @description Routes Restricted to Authorized Users Only
 *
 */
class AuthenticatedRoute extends React.Component {
  state = {
    authenticationInitialized: false,
    rejected: false
  };

  shouldComponentUpdate(prevProps, prevState) {
    if (
      // Render if Authentication is initialized AND session is Authenticated
      // OR Authentication is initialized AND session is rejected
      // OTHERWISE Nothing should be rendered
      (prevState.authenticationInitialized && prevProps.isAuthenticated) ||
      (prevState.authenticationInitialized && prevState.rejected)
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.props
      .authenticateSession()
      .then(session => {
        // TODO timeout to be removed / for dev purposes
        setTimeout(() => {
          if (session && validateSession(session)) {
            return this.setState({ authenticationInitialized: true, rejected: false });
          }
          this.setState({ authenticationInitialized: true, rejected: true });
        }, 300);
      })
      .catch(e => e);
  }

  getRedirectUrl(isAuthenticated, location, redirect) {
    const redirectUrl = location.pathname.indexOf(URL_LOGOUT) === -1 ? location.pathname : AUTH_LANDING_ROUTE;

    let redirectTo = `${URL_LOGIN}`;
    if (!isAuthenticated && redirect) {
      redirectTo = `${URL_LOGIN}?${URL_PARAM_REDIRECT}=${redirectUrl}`;
    } else if (isAuthenticated) {
      redirectTo = redirectUrl;
    }
    return redirectTo;
  }

  render() {
    const { component: WrappedComponent, ...restProps } = this.props;
    const redirectUrl = this.getRedirectUrl(restProps.isAuthenticated, this.props.location, this.props.redirect);
    return this.state.authenticationInitialized && this.props.isAuthenticated ? (
      <Route
        {...restProps}
        render={props => (
          // Authorization granted render component
          <PrivateConsumer ConsumingComponent={WrappedComponent} {...props} />
        )}
      />
    ) : !this.state.authenticationInitialized ? (
      // Performing Authentication / display Auth processing transition
      <ProcessingAuth />
    ) : (
      // Authorization is rejected / redirect to login
      <Reject to={redirectUrl} />
    );
  }
}
export default connect(
  ({ auth, transitions }) => ({
    ...auth,
    isLoading: transitions ? transitions.isLoading : false
  }),
  dispatch => bindActionCreators({ authenticateSession }, dispatch)
)(AuthenticatedRoute);
