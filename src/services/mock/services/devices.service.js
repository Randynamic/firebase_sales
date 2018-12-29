import { MockServices } from "./index";

import { Factory } from "rosie";
import { randomDate, generateMacAddress, randomId } from "../utils";

/**
 * @description Factory Class
 */
export class DevicesMockServices extends MockServices {
  constructor(attributes) {
    super(attributes);
    this.factoryDataSet = new Factory() //
      .sequence("id", () => randomId(32))
      .attrs({
        macAddr: generateMacAddress,
        status: false,
        activatedAt: randomDate,
        ...attributes
      });
  }
}
