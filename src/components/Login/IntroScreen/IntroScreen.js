import React from "react";

import styles from "./IntroScreen.scss";

export default props => {
  const backgroundImage = props.backgroundImage || "";
  return (
    <div className={styles.introScreen} style={{ backgroundImage: "url('" + backgroundImage + "')" }}>
      <div className={styles.introScreen__captions}>
        <h1>Header</h1>
        <h2>Subheader</h2>
      </div>
    </div>
  );
};
