import React from "react";
import Page from "../../containers/Page/Page";
import { Nav } from "../../components/Nav/Nav";

import styles from "./Homepage.scss";

export default props => {
  /**
   * testing firebase api's
   */
  props.firebase.doLogin().then(result => console.log(result));
  const storageRef = props.firebase.storage.ref();
  const dir__ref = storageRef.child("tmp_dir");
  dir__ref
    .getDownloadURL()
    .then(url => {
      console.log("url", url);
    })
    .catch(error => {
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break;

        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;

        case "storage/canceled":
          // User canceled the upload
          break;

        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break;
      }
      console.log(error);
    });
  return (
    <Page id="homepage" title={"Homepage"} {...props}>
      <main className={styles.hompage__wrapper}>
        <Nav {...props} />
        <section className={styles.hompage__wrapper__container} />
      </main>
    </Page>
  );
};
