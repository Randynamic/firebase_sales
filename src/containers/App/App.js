import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter } from "react-router-dom";

import Routes from "../../routes/Routes";

import { checkSession, authenticateSession } from "../../services/auth/auth";

import withFirebase from "../../hoc/Firebase";
import Firebase from "../../containers/Firebase";
import { FirebaseContext } from "../Contexts/Firebase";
import { I18nContext, defaultLocale, getI18nData } from "../Contexts/I18n";
import { SessionContext } from "../Contexts/Session";

const AppRoutes = props => {
  return <Routes {...props} />;
};

class AppComponent extends React.Component {
  state = {
    i18n: {}
  };

  initLanguage = async (locale = defaultLocale) => {
    const localeData = await getI18nData(locale);
    this.setState({ i18n: { ...this.state.i18n, ...localeData } });
  };

  async componentDidMount() {
    if (!this.state.languageData) {
      this.initLanguage();
    }
  }

  render() {
    return (
      <I18nContext.Provider value={{ i18n: { ...this.state.i18n, changeLanguage: this.initLanguage } }}>
        <SessionContext.Provider value={{ session: { currentUser: this.props.currentUser } }}>
          <FirebaseContext.Provider value={new Firebase()}>
            <AppRoutes {...this.props} />
          </FirebaseContext.Provider>
        </SessionContext.Provider>
      </I18nContext.Provider>
    );
  }
}

AppComponent.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authenticateSession: PropTypes.func.isRequired,
  checkSession: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth, ...rest }) => ({
  isAuthenticated: auth ? auth.isAuthenticated : false,
  currentUser: auth ? auth.currentUser : {},
  redirect: auth ? auth.redirect : false,
  rest
});

const mapDispatchToProps = dispatch => bindActionCreators({ authenticateSession, checkSession }, dispatch);

export default withFirebase(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(AppComponent)
  )
);