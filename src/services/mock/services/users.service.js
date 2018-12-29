import { MockServices } from "./index";
import { ClientsMockServices } from "./clients.service";

import { Factory } from "rosie";
import { randomId } from "../utils";

export class UsersMockServices extends MockServices {
  constructor(attributes) {
    super(attributes);
    this.factoryDataSet = new Factory()
      .sequence("id", () => randomId(32))
      .sequence("username", i => "username" + i)
      .sequence("password", i => "password" + i)
      .sequence("token", () => randomId(100))
      .attr("client_id", ["id"], id => {
        const _ClientsMockServices = new ClientsMockServices({ client_id: id });
        _ClientsMockServices.records = [];
        return { ..._ClientsMockServices.getRecords(1)[0] };
      })
      .attrs({
        validated: true,
        active: true,
        ...attributes
      });
    this.unvalidatedUserFactory = new Factory().extend(this.factoryDataSet).attr("validated", false);
  }
}
