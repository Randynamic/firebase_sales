import React from "react";
import Page from "../../containers/Page/Page";
import { Nav } from "../../components/Nav/Nav";

import styles from "./Homepage.scss";
import FileGrid from "../../containers/FileGrid/FileGrid";

export default class extends React.Component {
  render() {
    return (
      <Page id="homepage" title={"Homepage"} {...this.props}>
        <section className={styles.hompage__wrapper}>
          <Nav {...this.props} />
          <FileGrid {...this.props} />
        </section>
      </Page>
    );
  }
}
