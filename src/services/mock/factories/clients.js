import MockData from "../data";
import { ClientsMockServices } from "../services/clients.service";
import { randomBool } from "../utils";

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
  method: "get",
  url: "http://localhost:8080/clients",
  status: 200,
  headers: { "Content-Type": "application/json" },
  resolve: []
});

/**
 * @description Factory to resolve stubbed request
 */
export default async () => {
  const ServiceMock = new ClientsMockServices({
    status: randomBool,
    validated: randomBool
  });
  const createdData = ServiceMock.getRecords(10);
  Stub.init();
  Stub.setMockState(createdData);
  const state = await Stub.setResolvedState().then(result => result);
  Stub.close();
  return state;
};
