import * as firebaseApp from "firebase/app";

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
      firebaseApp.initializeApp(this.config);
    }
  }
}

export default Firebase;
