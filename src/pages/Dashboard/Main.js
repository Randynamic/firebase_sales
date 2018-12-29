import React from "react";
import Page from "../../containers/Page/Page";
import { Nav } from "../../components/Nav/Nav";

import styles from "./Dashboard.scss";

import DevicesTable from "../../containers/Tables/Devices";

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <Page id="dashboard" title={"Dashboard"} {...this.props}>
        <main className={styles.dashboard__wrapper}>
          <Nav {...this.props} />
          <section className={styles.dashboard__wrapper__container}>Dashboard</section>
          <section className={styles.dashboard__wrapper__container}>
            <DevicesTable i18n={this.props.i18n} />
          </section>
        </main>
      </Page>
    );
  }
}
