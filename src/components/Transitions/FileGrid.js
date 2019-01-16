import React from "react";

import styles from "../../containers/FileGrid/FileGrid.scss";

export const Loading = props => {
  return props.loading ? (
    <div className={styles.loading}>
      <span>Loading</span>
    </div>
  ) : (
    <></>
  );
};
