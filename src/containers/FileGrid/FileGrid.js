import React from "react";

import axios from "axios";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { checkSession, authenticateSession } from "../../services/auth/auth";

import styles from "./FileGrid.scss";

const Media = props => {
  const { data } = props;
  return (
    <div className={styles.box}>
      <img src={data.url} width={200} height={200} />
      <strong>{data.displayName}</strong>
      <div>{new Date().getTime()}</div>
      <div>{data.size}</div>
      <div>imageMeta1: {data.metadata.imageMeta1}</div>
      <div>imageMeta2: {data.metadata.imageMeta2}</div>
      <div>imageMeta3: {data.metadata.imageMeta3}</div>
      <div>owner: {data.metadata.owner}</div>
      {props.isAuthenticated && <button onClick={() => props.removeHandler(data)}>-Delete-</button>}
    </div>
  );
};

const PreviewFiles = props => {
  return (
    //
    <div className={styles.previewsWrapper}>
      Preview Files ({props.files.length})
      {props.files.map((file, index) => {
        return (
          <div key={file.name}>
            <img src={file.data} className={styles.previewImages} />
            <strong>{file.name}</strong>
            <div>{new Date().getTime()}</div>
            <div>{file.size}</div>
            <button onClick={() => props.removeHandler(file)}>-Delete-</button>
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
    return Math.random().toString(36);
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
                  return listedFile.name === file.name ? { ...file, url } : listedFile;
                });
              } else {
                newFilesList.push({ ...file, url });
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
      formData.append("imageFile", fileData.file);
      if (this.state.previewFiles.length - 1 === index) {
        formData.append("path", this.baseDir);
        formData.append("imageMeta1", "metaValue1");
        formData.append("imageMeta2", "metaValue2");
        formData.append("imageMeta3", "metaValue3");
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

  previewFilesHandler() {
    this.previewFiles = Array.from(this.filesToUpload.files);
    this.previewFiles.map((file, fileIndex) => {
      const fileToAppend = this.filesToUpload.files[fileIndex];
      const reader = new FileReader();
      reader.onload = e => {
        const previewFiles = this.state.previewFiles ? [...this.state.previewFiles] : [];
        if (!previewFiles.find(file => fileToAppend.name === file.name)) {
          previewFiles.push({ name: fileToAppend.name, data: e.target.result, file });
        }
        this.setState(prevState => {
          return { ...prevState, previewFiles };
        });
      };
      reader.readAsDataURL(fileToAppend);
    });
  }

  render() {
    return (
      <div className={"wrapper"}>
        {this.state.loading ? <div className={styles.loading}>Loading</div> : null}
        <div className={styles.wrapper}>
          {this.state.files.length > 0 && this.state.files.map((media, index) => <Media key={index} data={media} removeHandler={this.removeFile} isAuthenticated={this.props.isAuthenticated} />)}
          {this.state.files.length === 0 && (
            <>
              <hr />
              No Images Available
              <hr />
            </>
          )}
        </div>
        {this.props.isAuthenticated && (
          <>
            {this.state.previewFiles && this.state.previewFiles.length > 0 && (this.state.uploadProgress || this.state.uploadProgress > 0) && `${this.state.uploadProgress}%`}
            <hr />
            {this.state.previewFiles && this.state.previewFiles.length > 0 && <PreviewFiles files={this.state.previewFiles} removeHandler={this.removePreviewFile} />}
            <form className={styles.form} action={this.baseUrl + "/upload"} ref={ref => (this.formRef = ref)} method="post" encType="multipart/form-data" onSubmit={this.handleSubmit}>
              <input type="file" name="imageFile" multiple={true} key={this.state.refreshToken || ""} ref={ref => (this.filesToUpload = this.filesInputRef = ref)} onChange={this.previewFilesHandler} />
              <input type="hidden" name="path" value={this.baseDir} />
              <input type="hidden" name="imageMeta1" value="metaValue1" />
              <input type="hidden" name="imageMeta2" value="metaValue2" />
              <input type="hidden" name="imageMeta3" value="metaValue3" />
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
