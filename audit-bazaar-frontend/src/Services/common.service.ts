/**CUTOMIZE ADDRESS FOR SHOW */
export const customizeAddress = (address: string) => {
  let firstFive = address.substring(0, 5);
  let lastFour = address.substring(address.length - 4);
  return firstFive + "..." + lastFour;
};

/**CREATE URL FOR API CALL WITH PARAMS */
export const formatUrl = (url, params) => {
  params =
    params && Object.keys(params).length > 0
      ? `?${new URLSearchParams(params).toString()}`
      : ``;
  return `${url}${params}`;
};

/**ALLOW ONLY STRING */
export const allowOnlyString = (inputString) => {
  let res = /^[a-zA-Z]+$/.test(inputString);
  return res;
};