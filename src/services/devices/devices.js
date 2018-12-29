import stub from "../mock/factories/devices";
import PropTypes from "prop-types";

import API from "../../utils/effects";

/**
 * @description Devices Model.
 * @todo To be used as propTypes but also for DB Model
 */
const DevicesModel = {
  macAddr: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  activatedAt: PropTypes.instanceOf(Date),
  randomSeed: PropTypes.number.isRequired
};

/**
 * @description API Service: Get Devices
 */
export const getDevices = async () => {
  if (process.env.MOCK_DATA) {
    return await stub();
  }
  return await API.get(`/devices`)
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
export const getDeviceCols = () => Object.keys(DevicesModel);
