import React from "react";
import Page from "../../containers/Page/Page";

import styles from "./Content.scss";
import { Nav } from "../../components/Nav/Nav";

export default props => {
  return (
    <Page id="about-us" title={"About Us"} {...props}>
      <div className={styles.aboutUs__wrapper}>
        <Nav {...props} />
        <div className={styles.aboutUs__wrapper__container}>About Us</div>
      </div>
    </Page>
  );
};
