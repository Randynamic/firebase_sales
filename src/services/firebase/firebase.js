import { delay } from "../../utils/utils";

export const initConnection = () => {
  console.log("initialize firebase connection");
};

export const doLogin = async () => {
  console.log("do user authentication to firebase");
  await delay(1000);
  console.log("after 1 s");
  return {
    login: true
  };
};
