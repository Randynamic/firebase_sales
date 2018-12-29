import React, { Component } from "react";
import Helmet from "react-helmet";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { checkSession, authenticateSession } from "../../services/auth/auth";

import { getMetaTags, htmlAttributes, getPath, getTitle } from "./utils";

import styles from "./Page.scss";

class Page extends Component {
  render() {
    const { children, id, className, schema, ...pageProps } = this.props;
    const title = getTitle(pageProps.title);
    const links = [{ rel: "canonical", href: getPath(this.props.location.pathname) }];
    const meta = getMetaTags(pageProps, this.props.location.pathname);
    return (
      <main id={id} className={styles.page__wrapper}>
        <Helmet htmlAttributes={htmlAttributes(schema)} title={title} link={links} meta={meta} />
        {children}
      </main>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth ? auth.isAuthenticated : false,
  redirect: auth ? auth.redirect : false
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      authenticateSession,
      checkSession
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
