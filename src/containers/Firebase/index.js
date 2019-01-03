import * as firebaseApp from "firebase/app";
//
import * as firebaseStorage from "firebase/storage";

export const aggregation = (baseClass, ...mixins) => {
  class base extends baseClass {
    constructor(...args) {
      super(...args);
      mixins.forEach(mixin => {
        copyProps(this, new mixin());
      });
    }
  }
  let copyProps = (target, source) => {
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach(prop => {
        if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
      });
  };
  mixins.forEach(mixin => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};

class Firebase {
  config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

  constructor() {
    if (!firebaseApp.apps.length) {
      this.app = firebaseApp;
      this.app.initializeApp(this.config);
    } else {
      this.app = firebaseApp.apps[0];
    }
    this.storage = this.app.storage();
  }
}

export default Firebase;
