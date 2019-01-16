import React from "react";

import { byteSize } from "../../utils/utils";

import styles from "./FileGrid.scss";

const DataTransferArea = props => {
  return (
    <div className={styles.dataTransferArea}>
      <span>Upload files</span>
    </div>
  );
};

export default props => {
  return (
    <div className={styles.previewsWrapper}>
      {props.files && props.files.length > 0 ? (
        <>
          <div className={styles.header}>
            {props.i18n._("files_to_upload")} ({props.files.length})
          </div>
          {props.files.map((fileItem, index) => {
            const { file } = fileItem;
            const fileExists = props.listedFiles.find(item => item.displayName === fileItem.name);
            const initMetaData = (fileExists && fileExists.metadata) || {};
            return (
              <div key={fileItem.name} className={styles.thumbWrapper} data-file-exists={fileExists ? true : false}>
                <img key={fileItem.uid} src={fileItem.data} className={styles.previewImages} />
                <strong>{file.name}</strong>
                <div className={styles.fileSizeLabel}>{byteSize(file.size)}</div>
                {props.metaData &&
                  props.metaData[fileItem.uid] &&
                  Object.keys(props.metaData[fileItem.uid]).map((value, key) => (
                    <div key={key} className={styles.metaData}>
                      <b>{props.i18n._(value)}</b>: {props.metaData[fileItem.uid][value]}
                    </div>
                  ))}
                <input type="text" data-uid={fileItem.uid} data-meta-key={"meta1"} data-init-value={initMetaData["meta1"]} placeholder={initMetaData["meta1"] || "meta 1"} onChange={props.handleMetadata.bind(this)()} onClick={props.handleInitMetadata.bind(this)()} onBlur={props.handleInitMetadata.bind(this)()} />
                <input type="text" data-uid={fileItem.uid} data-meta-key={"meta2"} data-init-value={initMetaData["meta2"]} placeholder={initMetaData["meta2"] || "meta 2"} onChange={props.handleMetadata.bind(this)()} onClick={props.handleInitMetadata.bind(this)()} onBlur={props.handleInitMetadata.bind(this)()} />
                <button className={styles.deleteBtn} onClick={() => props.removeHandler(fileItem)}>
                  x
                </button>
              </div>
            );
          })}
          <DataTransferArea />
        </>
      ) : (
        <DataTransferArea />
      )}
    </div>
  );
};
