import React from "react";

import MediaTiles, { NoMediaFiles } from "./MediaTiles";
import PreviewFiles from "./PreviewFiles";

import styles from "./FileGrid.scss";

export const filesGrid = function() {
  const { i18n } = this.props;
  return (
    <>
      <div className={styles.wrapper}>
        {this.state.files.length > 0 ? (
          <>
            <div className={styles.header}>
              {i18n._("uploaded_files")} ({this.state.files.length})
            </div>
            {this.state.files.map((media, index) => (
              <MediaTiles i18n={i18n} key={index} data={media} removeHandler={this.removeFile} isAuthenticated={this.props.isAuthenticated} />
            ))}
          </>
        ) : (
          <NoMediaFiles i18n={this.props.i18n} />
        )}
        ;
      </div>
    </>
  );
};

export const uploaderComponent = function() {
  const { i18n } = this.props;
  return (
    <>
      {this.state.previewFiles && this.state.previewFiles.length > 0 && (this.state.uploadProgress || this.state.uploadProgress > 0) && `${this.state.uploadProgress}%`}
      <hr />
      <PreviewFiles //
        i18n={i18n}
        listedFiles={this.state.files}
        files={this.state.previewFiles}
        removeHandler={this.removePreviewFile}
        metaData={this.state.filesMetaData}
        handleInitMetadata={() => this.handleInitMetadata.bind(this)}
        handleMetadata={() => this.handleMetadata.bind(this)}
      />
      <form className={styles.form} action={this.baseUrl + "/upload"} ref={ref => (this.formRef = ref)} method="post" encType="multipart/form-data" onSubmit={this.handleSubmit}>
        <input type="file" name="imageFile" multiple={true} key={this.state.refreshToken || ""} ref={ref => (this.filesToUpload = this.filesInputRef = ref)} onChange={this.previewFilesHandler} />
        <input type="hidden" name="path" value={this.baseDir} />
        <input type="submit" value="Upload" />
      </form>
    </>
  );
};
