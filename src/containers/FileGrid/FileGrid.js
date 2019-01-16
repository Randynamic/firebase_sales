import React from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { checkSession, authenticateSession } from "../../services/auth/auth";

import { Loading } from "../../components/Transitions/FileGrid";

import { getFiles, getToken, handleInitMetadata, handleMetadata, handleSubmit, initRequest, previewFilesHandler, removeFile, removePreviewFile, resetForm } from "./handlers";

import { filesGrid, uploaderComponent } from "./gridComponentHandlers";

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
    this.storageRef = this.props.firebase.storage.ref();

    this.filesGrid = filesGrid.bind(this);
    this.uploaderComponent = uploaderComponent.bind(this);

    this.previewFilesHandler = previewFilesHandler.bind(this);
    this.handleSubmit = handleSubmit.bind(this);
    this.getFiles = getFiles.bind(this);
    this.getToken = getToken.bind(this);
    this.handleInitMetadata = handleInitMetadata.bind(this);
    this.handleMetadata = handleMetadata.bind(this);
    this.initRequest = initRequest.bind(this);
    this.removeFile = removeFile.bind(this);
    this.removePreviewFile = removePreviewFile.bind(this);
    this.resetForm = resetForm.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.initRequest();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <div className={"wrapper"}>
        <Loading {...this.props} loading={this.state.loading} />
        {this.filesGrid()}
        {this.props.isAuthenticated && this.uploaderComponent()}
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
