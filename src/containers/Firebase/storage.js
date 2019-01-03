import Firebase, { aggregation } from ".";
import * as firebaseStorage from "firebase/storage";

/**
 * @description Using an expression as extention to be able to extend from multiple classes
 */
export default class extends aggregation(Firebase) {
  constructor() {
    super();
    this.storage = this.app.storage();
  }

  listFiles() {
    console.log("list files", this.config);
  }
}
