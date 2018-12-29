import MockData from "../data";
import { UsersMockServices } from "../services/users.service";
import { randomBool, randomSeed } from "../utils";

/**
 *
 * STUB Service
 * @description Setup Mock Service
 * @param {string} method HTTP Methods
 * @param {string} url Endpoint url
 * @param {number} status HTTP Status code to return
 * @param {object} headers HTTP Headers
 * @param {any}	resolve Resolved value for success response
 * @param {object:error} error Rejected error object { ok:boolean, type:string, error:boolean, message:string }
 */
const Stub = new MockData({
  method: "post",
  url: "http://localhost:8080/auth/getToken",
  status: 200,
  headers: { "Content-Type": "application/json" },
  resolve: [],
  error: { ok: false, type: "error", error: true, message: "Invalid User or Password" }
});

/**
 * @description Factory to resolve stubbed request
 */
export default async (username, password) => {
  const ServicesMock = new UsersMockServices({
    status: randomBool,
    randomSeed
  });
  const createdData = ServicesMock.getRecords(1);
  Stub.init();
  Stub.setMockState(createdData);
  let state = {};
  if (username === "demo" && password === "demo") {
    state = await Stub.setResolvedState().then(result => {
      return { ok: true, ...result[0] };
    });
  } else {
    throw { ...Stub.config.error };
  }
  Stub.close();
  return state;
};
