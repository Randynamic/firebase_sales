import React from "react";
import { connect } from "react-redux";
import qs from "query-string";
import { Redirect } from "react-router-dom";

import { URL_LOGIN, URL_PARAM_REDIRECT, URL_ERROR, URL_DASHBOARD } from "../../store/constants";

const GetToken = props => {
  let query = qs.parse(props.location.search);
  let outlet;
  if (!props.isAuthenticated) {
    if (query.error) {
      outlet = <Redirect to={`${URL_ERROR}?type=${query.error}`} />;
    } else {
      outlet = <Redirect to={`${URL_LOGIN}?${URL_PARAM_REDIRECT}=${props.location.pathname}`} />;
    }
  } else {
    outlet = <Redirect to={query.redirect || URL_DASHBOARD} />;
  }
  return outlet;
};

export default connect(
  state => state,
  null
)(GetToken);
