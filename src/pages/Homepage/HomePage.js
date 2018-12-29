import React from "react";
import Page from "../../containers/Page/Page";
import { Nav } from "../../components/Nav/Nav";

import styles from "./Homepage.scss";

export default props => {
  return (
    <Page id="homepage" title={"Homepage"} {...props}>
      <main className={styles.hompage__wrapper}>
        <Nav {...props} />
        <section className={styles.hompage__wrapper__container} />
      </main>
    </Page>
  );
};
