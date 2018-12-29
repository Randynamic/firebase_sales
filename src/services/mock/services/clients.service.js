import { MockServices } from "./index";

import { DevicesMockServices } from "./devices.service";

import { Factory } from "rosie";
import { randomInt, randomId } from "../utils";

/**
 * @description Factory Class
 */
export class ClientsMockServices extends MockServices {
  constructor(attributes) {
    super(attributes);
    this.factoryDataSet = new Factory()
      .sequence("id", () => randomId(32))
      .sequence("name", i => "Client " + i)
      .sequence("client_id", () => randomId(32))
      .attr("devices", ["client_id"], client_id => {
        const _DevicesMockServices = new DevicesMockServices({ client_id });
        _DevicesMockServices.records = [];
        return [..._DevicesMockServices.getRecords(randomInt(0, 3))];
      })
      .attrs({ validated: true, active: true, ...attributes });
    this.unvalidatedClientFactory = new Factory().extend(this.factoryDataSet).attr("validated", false);
  }
}
