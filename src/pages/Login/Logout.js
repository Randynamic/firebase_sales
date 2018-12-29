import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import { URL_LOGIN } from "../../store/constants";

import { logoutUser } from "../../services/auth/auth";

export class Logout extends React.Component {
  componentDidMount() {
    this.props.logoutUser();
  }
  render() {
    if (this.props.auth && this.props.auth.currentUser) {
      return <h1>Logout...</h1>;
    }
    return <Redirect to={URL_LOGIN} />;
  }
}

export default connect(
  state => state,
  dispatch => bindActionCreators({ logoutUser }, dispatch)
)(Logout);
