import React from "react";

import Firebase from "../../containers/Firebase";
import FirebaseStorage from "../../containers/Firebase/storage";

import * as firebaseServices from "../../services/firebase/firebase";

export { initConnection } from "../../services/firebase/firebase";

export const FirebaseContext = React.createContext({
  ...new Firebase(),
  ...firebaseServices
});
