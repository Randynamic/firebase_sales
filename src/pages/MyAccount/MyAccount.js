import React from "react";
import Page from "../../containers/Page/Page";
import { Nav } from "../../components/Nav/Nav";
import LanguageSelectors from "../../components/Buttons/LanguageSelectors";

import styles from "./MyAccount.scss";

import ClientsTable from "../../containers/Tables/Clients";

export default props => {
  return (
    <Page id="myAccount" title={"My Account"} {...props}>
      <div className={styles.myaccount__wrapper}>
        <Nav locale={props.i18n.locale} {...props} />
        <section>My Accounts</section>
        <section>
          <ClientsTable />
          <LanguageSelectors {...props} />
        </section>
      </div>
    </Page>
  );
};
