import React from "react";
import Page from "../../containers/Page/Page";
import { Nav } from "../../components/Nav/Nav";

import axios from "axios";

import styles from "./Homepage.scss";

const Media = props => {
  const { data } = props;
  return (
    <div className={styles.box}>
      <img src={data.url} width={200} height={200} />
      <strong>{data.displayName}</strong>
      <div>{data.size}</div>
      <div>imageMeta1: {data.metadata.imageMeta1}</div>
      <div>imageMeta2: {data.metadata.imageMeta2}</div>
      <div>imageMeta3: {data.metadata.imageMeta3}</div>
      <div>owner: {data.metadata.owner}</div>
      <button onClick={() => props.removeHandler(data)}>-Delete-</button>
    </div>
  );
};

export default class extends React.Component {
  state = {
    files: []
  };
  baseUrl = "http://localhost:5001/api/v1/storage";
  baseDir = "upload_tmp_dir/";
  formRef;
  filesToUpload;
  uploadProgress = 0;

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.removeFile = this.removeFile.bind(this);
  }

  componentDidMount() {
    this.initRequest();
  }

  getFiles = files => {
    files.map(file => {
      const storageRef = this.props.firebase.storage.ref();
      storageRef
        .child(file.name)
        .getDownloadURL()
        .then(url => {
          this.setState(prevState => {
            return { ...prevState, files: [...prevState.files, { ...file, url }] };
          });
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
      return {
        ...prevState,
        files: newFilesList
      };
    });
  };

  initRequest = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        files: []
      };
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

  handleSubmit(e) {
    e.preventDefault();
    const uploadUrl = this.formRef.action;
    const config = {
      onUploadProgress: progressEvent => {
        this.setState(prevState => {
          return {
            ...prevState,
            uploadProgress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
          };
        });
      }
    };
    const uploadData = new FormData();
    Object.keys(this.filesToUpload.files).map(fileIndex => {
      uploadData.append("imageFile", this.filesToUpload.files[fileIndex]);
    });

    uploadData.append("path", this.baseDir);
    uploadData.append("imageMeta1", "metaValue1");
    uploadData.append("imageMeta2", "metaValue2");
    uploadData.append("imageMeta3", "metaValue3");

    axios
      .post(uploadUrl, uploadData, config)
      .then(result => {
        this.getFiles(result.data.responses);
      })
      .catch(e => console.log("error", e));
  }

  render() {
    return (
      <Page id="homepage" title={"Homepage"} {...this.props}>
        <main className={styles.hompage__wrapper}>
          <Nav {...this.props} />
          <section className={styles.hompage__wrapper__container} />
          <div className={styles.wrapper}>
            {this.state.files.length > 0 && this.state.files.map((media, index) => <Media key={index} data={media} removeHandler={this.removeFile} />)}
            {this.state.files.length === 0 && (
              <>
                <hr />
                No Images Available
                <hr />
              </>
            )}
          </div>
          {(this.state.uploadProgress || this.state.uploadProgress > 0) && `${this.state.uploadProgress}%`}
          <form className={styles.form} action={this.baseUrl + "/upload"} ref={ref => (this.formRef = ref)} method="post" encType="multipart/form-data" onSubmit={this.handleSubmit}>
            <input type="file" name="imageFile" multiple={true} ref={ref => (this.filesToUpload = ref)} />
            <input type="hidden" name="path" value={this.baseDir} />
            <input type="hidden" name="imageMeta1" value="metaValue1" />
            <input type="hidden" name="imageMeta2" value="metaValue2" />
            <input type="hidden" name="imageMeta3" value="metaValue3" />
            <input type="submit" value="Upload" />
          </form>
        </main>
      </Page>
    );
  }
}
