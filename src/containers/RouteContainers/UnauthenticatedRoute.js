import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { authenticateSession } from "../../services/auth/auth";

import { PrivateConsumer } from "../Contexts/RootConsumer";

/**
 *
 * @name UnauthenticatedRoute
 *
 * Stateful Unauthenticated Route Component
 * @description	Used to process authorization to Authorized Routes
 *
 */
class UnauthenticatedRoute extends React.Component {
  render() {
    const { component: WrappedComponent, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={
          //
          props => <PrivateConsumer ConsumingComponent={WrappedComponent} {...props} />
        }
      />
    );
  }
}
export default connect(
  ({ auth, ...rest }) => ({
    ...auth,
    ...rest
  }),
  dispatch => bindActionCreators({ authenticateSession }, dispatch)
)(UnauthenticatedRoute);
