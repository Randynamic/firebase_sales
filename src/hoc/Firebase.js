import React from "react";

import { FirebaseContext } from "../containers/Contexts/Firebase";

const withFirebase = Component => props => {
  return (
    <FirebaseContext.Consumer>
      {firebase => {
        return <Component {...props} firebase={firebase} />;
      }}
    </FirebaseContext.Consumer>
  );
};

export default withFirebase;
