import React from "react";

import { byteSize } from "../../utils/utils";

import styles from "./FileGrid.scss";

export const NoMediaFiles = props => <div className={styles.header}>{props.i18n._("no_images_available")}</div>;

export default props => {
  const { data } = props;
  return (
    <div className={styles.box}>
      <a href={data.url} target="_blank">
        <img key={data.uid} src={data.url} width={200} height={200} />
      </a>
      <strong>{data.displayName}</strong>
      <div className={styles.fileSizeLabel}>{byteSize(data.size)}</div>
      {data.metadata &&
        Object.keys(data.metadata).map((value, key) => (
          <div key={key} className={styles.metaData}>
            <b>{props.i18n._(value)}</b>: {data.metadata[value]}
          </div>
        ))}
      {props.isAuthenticated && (
        <button className={styles.deleteBtn} onClick={() => props.removeHandler(data)}>
          x
        </button>
      )}
    </div>
  );
};
