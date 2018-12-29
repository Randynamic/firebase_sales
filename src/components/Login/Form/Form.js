import React from "react";
import qs from "query-string";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";

import { loginUser } from "../../../services/auth/auth";

import styles from "./Form.scss";

import { Nav } from "../../Nav/Nav";

import { AUTH_LANDING_ROUTE } from "../../../store/constants";

import * as SubmitButtons from "../../Buttons/SubmitButtons";
import Feedback from "../../Feedback/Feedback";

export class LoginForm extends React.Component {
  state = {
    username: "demo",
    password: "demo",
    redirectTo: qs.parse(this.props.location.search).redirect || AUTH_LANDING_ROUTE,
    loggedIn: undefined
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const targetValue = event.target.getAttribute("id");
    this.setState({ [targetValue]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.username && this.state.password) {
      const loggedIn = await this.props.loginUser(this.state.username, this.state.password);
      if (!loggedIn.ok) {
        this.setState({ loggedIn });
      }
    }
  }

  render() {
    return (
      <section className={styles.form__wrapper}>
        <header>
          <h1>Login</h1>
          <Nav {...this.props} />
        </header>
        {this.state.loggedIn && !this.state.loggedIn.ok && <Feedback feedback={this.state.loggedIn} />}
        <section>
          {this.props.auth.isAuthenticated ? (
            <Redirect to={this.state.redirectTo} />
          ) : (
            <form onSubmit={this.handleSubmit} className={styles.form__wrapper__inputs}>
              <input id="username" type="text" value={this.state.username} onChange={this.handleChange} />
              <input id="password" type="password" value={this.state.password} onChange={this.handleChange} />
              <SubmitButtons.defaultBtn id="loginBtn">Submit Login</SubmitButtons.defaultBtn>
            </form>
          )}
        </section>
      </section>
    );
  }
}

export default connect(
  state => state,
  dispatch => bindActionCreators({ loginUser }, dispatch)
)(LoginForm);
