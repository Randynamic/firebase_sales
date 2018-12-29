/**
 * @description Random data generators
 *
 */

export const randomDate = (start = new Date(2012, 0, 1), end = new Date()) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
export const randomBool = () => (Math.random() > 0.5 ? true : false);
export const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return rand;
};
export const randomFloat = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rand = Math.random() * (max - min + randomInt(0, 1)) + min;
  return rand;
};
export const generateMacAddress = () => {
  var hexDigits = "0123456789ABCDEF";
  var macAddress = "";
  for (var i = 0; i < 6; i++) {
    macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
    macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
    if (i != 5) macAddress += ":";
  }
  return macAddress;
};
export const randomSeed = () => +("" + Math.random() * 10000).split(".")[1];
export const randomId = length => {
  if (!length) {
    length = 8;
  }
  var str = "";
  for (var i = 1; i < length + 1; i = i + 8) {
    str += Math.random()
      .toString(36)
      .substr(2, 10);
  }
  return str.substr(0, length);
};
