import stub from "../mock/factories/clients";
import PropTypes from "prop-types";

import API from "../../utils/effects";

/**
 * @description Clients Model.
 * @todo To be used as propTypes but also for DB Model
 */
const ClientsModel = {
  name: PropTypes.string.isRequired,
  validated: PropTypes.bool.isRequired,
  devices: PropTypes.array
};

/**
 * @description API Service: Get Clients
 */
export const getClients = async () => {
  if (process.env.MOCK_DATA) {
    return await stub();
  }
  return await API.get(`/clients`)
    .then(result => {
      if (result.data && result.data.ok) {
        return result.data;
      }
      return null;
    })
    .catch(e => {
      return null;
    });
};

/**
 * @description Return Model Keys. Temp. for table creation.
 * @todo The cols need to be mapped with a i18n label
 */
export const getClientsCols = () => Object.keys(ClientsModel);
