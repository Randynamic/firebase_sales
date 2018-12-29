import React from "react";
import { Link } from "react-router-dom";
import { URL_LOGIN, URL_LOGOUT, URL_DASHBOARD, URL_ABOUT_US, URL_MY_ACCOUNT } from "../../store/constants";
import LanguageSelectors from "../Buttons/LanguageSelectors";

export const Nav = ({ i18n, ...props }) => {
  const { _, activeLanguage } = i18n;
  return (
    <nav>
      <div>Nav Component Locale [{activeLanguage}]</div>
      <Link to={URL_LOGIN}>{_("login")}</Link>
      {" | "}
      <Link to={URL_DASHBOARD}>{_("dashboard")}</Link>
      {" | "}
      <Link to={URL_ABOUT_US}>{_("aboutUs")}</Link>
      {" | "}
      <Link to={URL_MY_ACCOUNT}>{_("myAccount")}</Link>
      {" | "}
      <Link to={URL_LOGOUT}>{_("logout")}</Link>
      <hr />
      <LanguageSelectors i18n={i18n} />
    </nav>
  );
};
