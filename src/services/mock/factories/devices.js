import MockData from "../data";
import { DevicesMockServices } from "../services/devices.service";
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
  method: "get",
  url: "http://localhost:8080/devices",
  status: 200,
  headers: { "Content-Type": "application/json" },
  resolve: []
});

/**
 * @description Factory to resolve stubbed request
 */
export default async () => {
  const ServicesMock = new DevicesMockServices({
    status: randomBool,
    randomSeed
  });
  const createdData = ServicesMock.getRecords(5);
  Stub.init();
  Stub.setMockState(createdData);
  const state = await Stub.setResolvedState().then(result => result);
  Stub.close();
  return state;
};
