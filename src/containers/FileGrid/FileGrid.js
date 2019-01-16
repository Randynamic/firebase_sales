import React from "react";

import axios from "axios";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { byteSize } from "../../utils/utils";

import { checkSession, authenticateSession } from "../../services/auth/auth";

import styles from "./FileGrid.scss";

const Media = props => {
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

const PreviewFiles = props => {
  return (
    <div className={styles.previewsWrapper}>
      Preview Files ({props.files.length})
      {props.files.map((file, index) => {
        const fileExists = props.listedFiles.find(item => item.displayName === file.name);
        const initMetaData = (fileExists && fileExists.metadata) || {};
        return (
          <div key={file.name} className={styles.thumbWrapper}>
            <img key={file.uid} src={file.data} className={styles.previewImages} />
            <strong>{file.name}</strong>
            <div className={styles.fileSizeLabel}>{byteSize(file.size)}</div>
            {props.metaData &&
              props.metaData[file.uid] &&
              Object.keys(props.metaData[file.uid]).map((value, key) => (
                <div key={key} className={styles.metaData}>
                  <b>{props.i18n._(value)}</b>: {props.metaData[file.uid][value]}
                </div>
              ))}
            <input type="text" data-uid={file.uid} data-meta-key={"meta1"} data-init-value={initMetaData["meta1"]} placeholder={initMetaData["meta1"] || "meta 1"} onChange={props.handleMetadata.bind(this)()} onClick={props.handleInitMetadata.bind(this)()} onBlur={props.handleInitMetadata.bind(this)()} />
            <input type="text" data-uid={file.uid} data-meta-key={"meta2"} data-init-value={initMetaData["meta2"]} placeholder={initMetaData["meta2"] || "meta 2"} onChange={props.handleMetadata.bind(this)()} onClick={props.handleInitMetadata.bind(this)()} onBlur={props.handleInitMetadata.bind(this)()} />
            <button className={styles.deleteBtn} onClick={() => props.removeHandler(file)}>
              x
            </button>
          </div>
        );
      })}
    </div>
  );
};

export class FileGrid extends React.Component {
  state = { files: [] };
  baseUrl = "http://localhost:5001/api/v1/storage";
  baseDir = "upload_tmp_dir/";
  formRef;
  filesToUpload;
  loading = false;
  uploadProgress = 0;
  mounted = false;
  uploadData = undefined;
  previewFiles = [];
  refreshToken = "";
  filesMetaData = {};

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.previewFilesHandler = this.previewFilesHandler.bind(this);
    this.storageRef = this.props.firebase.storage.ref();
  }

  componentDidMount() {
    this.mounted = true;
    this.initRequest();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getToken() {
    return Math.random(10)
      .toString(36)
      .split(".")
      .pop();
  }

  getFiles = files => {
    if (files.length > 0) {
      this.setState({ loading: true });
    }
    this.mounted &&
      files.map((file, index) => {
        this.storageRef
          .child(file.name)
          .getDownloadURL()
          .then(url => {
            const newFilesList = [...this.state.files];
            this.setState(prevState => {
              const fileExists = newFilesList.find(listFile => file.name === listFile.name);
              if (fileExists) {
                newFilesList.map(listedFile => {
                  listedFile.uid = this.getToken();
                  return listedFile.name === file.name ? { ...file, url } : listedFile;
                });
              } else {
                newFilesList.push({ ...file, url, uid: this.getToken() });
              }
              return { ...prevState, files: newFilesList };
            });
            if (files.length - 1 === index) {
              this.setState({ loading: false });
            }
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
      });
  };

  removeFile = file => {
    if (!window.confirm(this.props.i18n._("sure_to_remove_file"))) {
      return false;
    }
    const fileName = encodeURIComponent(file.name);
    const index = this.state.files.findIndex(_file => _file.name === file.name);
    const newFilesList = [...this.state.files];
    newFilesList.splice(index, 1);
    this.setState(prevState => {
      axios
        .delete(this.baseUrl + "/getFile/" + fileName)
        .then(result => result)
        .catch(e => console.log("getFiles E >", e));
      return { ...prevState, files: newFilesList };
    });
  };

  removePreviewFile = file => {
    let previewFiles = [...this.state.previewFiles];
    previewFiles = previewFiles.filter(item => item.name !== file.name);
    this.setState(prevState => {
      return { ...prevState, previewFiles, refreshToken: this.getToken() };
    });
  };

  initRequest = () => {
    this.setState(prevState => {
      return { ...prevState, files: [] };
    });
    axios
      .get(this.baseUrl + "/getFiles/" + this.baseDir)
      .then(({ data }) => {
        if (data.ok && data.data && data.data.objects) {
          this.getFiles(data.data.objects);
        }
      })
      .catch(e => console.log("getFiles E >", e));
  };

  resetForm() {
    this.setState(prevState => {
      return { ...prevState, previewFiles: [], refreshToken: this.getToken() };
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.previewFiles && this.state.previewFiles.length === 0) {
      return false;
    }
    const uploadUrl = this.formRef.action;
    const config = {
      onUploadProgress: progressEvent => {
        this.setState(prevState => {
          return { ...prevState, uploadProgress: Math.round((progressEvent.loaded * 100) / progressEvent.total) };
        });
      }
    };

    const formData = new FormData();
    this.state.previewFiles.map((fileData, index) => {
      this.setState({ loading: true });
      formData.append(fileData.uid, fileData.file);
      if (this.state.previewFiles.length - 1 === index) {
        formData.append("path", this.baseDir);
        formData.append("imageMetaData", JSON.stringify(this.state.filesMetaData));
        axios
          .post(uploadUrl, formData, config)
          .then(result => {
            this.resetForm();
            this.getFiles(result.data.responses);
          })
          .catch(e => console.log("error", e));
      }
    });
  }

  handleInitMetadata(e) {
    const { uid, metaKey, initValue } = e.currentTarget.dataset;
    if (!this.state.filesMetaData[uid][metaKey]) {
      const initMetaData = { [metaKey]: initValue };
      this.setState(prevState => {
        return {
          ...prevState,
          filesMetaData: {
            ...prevState.filesMetaData,
            [uid]: {
              ...prevState.filesMetaData[uid],
              ...initMetaData
            }
          }
        };
      });
    }
  }

  handleMetadata(e) {
    e.persist();
    const { uid, metaKey } = e.currentTarget.dataset;
    const metaData = { [metaKey]: e.currentTarget.value };
    this.setState(prevState => {
      let newState = {};
      if (prevState.filesMetaData && prevState.filesMetaData[uid]) {
        newState = {
          ...prevState,
          filesMetaData: {
            ...prevState.filesMetaData,
            [uid]: {
              ...prevState.filesMetaData[uid],
              ...metaData
            }
          }
        };
      } else {
        newState = {
          ...prevState,
          filesMetaData: {
            ...prevState.filesMetaData,
            [uid]: {
              ...metaData
            }
          }
        };
      }
      return newState;
    });
  }

  previewFilesHandler() {
    this.previewFiles = Array.from(this.filesToUpload.files);
    this.previewFiles.map((file, fileIndex) => {
      const fileToAppend = this.filesToUpload.files[fileIndex];
      const reader = new FileReader();
      reader.onload = e => {
        const previewFiles = this.state.previewFiles ? [...this.state.previewFiles] : [];
        const uid = this.getToken();
        if (!previewFiles.find(file => fileToAppend.name === file.name)) {
          previewFiles.push({ name: fileToAppend.name, data: e.target.result, file, uid });
        }
        this.setState(prevState => {
          return {
            ...prevState,
            previewFiles,
            filesMetaData: {
              ...prevState.filesMetaData,
              [uid]: {}
            }
          };
        });
      };
      reader.readAsDataURL(fileToAppend);
    });
  }

  render() {
    const { i18n } = this.props;
    return (
      <div className={"wrapper"}>
        {this.state.loading ? <div className={styles.loading}>Loading</div> : null}
        <div className={styles.wrapper}>
          {this.state.files.length > 0 && this.state.files.map((media, index) => <Media i18n={i18n} key={index} data={media} removeHandler={this.removeFile} isAuthenticated={this.props.isAuthenticated} />)}
          {this.state.files.length === 0 && (
            <>
              <hr />
              {i18n._("no_images_available")}
              <hr />
            </>
          )}
        </div>
        {this.props.isAuthenticated && (
          <>
            {this.state.previewFiles && this.state.previewFiles.length > 0 && (this.state.uploadProgress || this.state.uploadProgress > 0) && `${this.state.uploadProgress}%`}
            <hr />
            {this.state.previewFiles && this.state.previewFiles.length > 0 && (
              <PreviewFiles
                //
                i18n={i18n}
                listedFiles={this.state.files}
                files={this.state.previewFiles}
                removeHandler={this.removePreviewFile}
                metaData={this.state.filesMetaData}
                handleInitMetadata={() => this.handleInitMetadata.bind(this)}
                handleMetadata={() => this.handleMetadata.bind(this)}
              />
            )}
            <form className={styles.form} action={this.baseUrl + "/upload"} ref={ref => (this.formRef = ref)} method="post" encType="multipart/form-data" onSubmit={this.handleSubmit}>
              <input type="file" name="imageFile" multiple={true} key={this.state.refreshToken || ""} ref={ref => (this.filesToUpload = this.filesInputRef = ref)} onChange={this.previewFilesHandler} />
              <input type="hidden" name="path" value={this.baseDir} />
              <input type="submit" value="Upload" />
            </form>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth ? auth.isAuthenticated : false,
  redirect: auth ? auth.redirect : false
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      authenticateSession,
      checkSession
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileGrid);
