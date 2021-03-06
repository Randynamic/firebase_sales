import React from "react";
import { Link } from "react-router-dom";
import { URL_ROOT, URL_LOGIN, URL_LOGOUT, URL_DASHBOARD } from "../../store/constants";
import LanguageSelectors from "../Buttons/LanguageSelectors";

export const Nav = ({ i18n, ...props }) => {
  const { _, activeLanguage } = i18n;
  return (
    <nav>
      <Link to={URL_ROOT}>{_("root")}</Link>
      {` [${activeLanguage}]`}
      {props.session.isAuthenticated ? (
        <>
          {" | "}
          <Link to={URL_DASHBOARD}>{_("dashboard")}</Link>
          {" | "}
          <Link to={URL_LOGOUT}>{_("logout")}</Link>
        </>
      ) : (
        <>
          {" | "}
          <Link to={URL_LOGIN}>{_("login")}</Link>
        </>
      )}
      <hr />
      <LanguageSelectors i18n={i18n} />
    </nav>
  );
};
