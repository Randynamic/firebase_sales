import React from "react";
import Page from "../../containers/Page/Page";

import LoginForm from "../../components/Login/Form/Form";
import IntroScreen from "../../components/Login/IntroScreen/IntroScreen";

import styles from "./Login.scss";

export default props => (
  <Page id="login" title={"Login"} {...props}>
    <main className={styles.page}>
      <section className={styles.page__sidebar}>
        <LoginForm {...props} />
      </section>
      <section className={styles.page__content}>
        <IntroScreen />
      </section>
    </main>
  </Page>
);
