import axios from "axios";

export const getToken = function() {
  return Math.random(10)
    .toString(36)
    .split(".")
    .pop();
};

export const getFiles = function(files) {
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

export const removeFile = function(file) {
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

export const removePreviewFile = function(file) {
  let previewFiles = [...this.state.previewFiles];
  previewFiles = previewFiles.filter(item => item.name !== file.name);
  this.setState(prevState => {
    return { ...prevState, previewFiles, refreshToken: this.getToken() };
  });
};

export const initRequest = function() {
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

export const resetForm = function() {
  this.setState(prevState => {
    return { ...prevState, previewFiles: [], refreshToken: this.getToken() };
  });
};

export const handleSubmit = function(e) {
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
};

export const handleInitMetadata = function(e) {
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
};

export const handleMetadata = function(e) {
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
};

export const previewFilesHandler = function() {
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
};
