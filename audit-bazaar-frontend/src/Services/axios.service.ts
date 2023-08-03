import axios from "axios";
import toaster from "../Components/Common/Toast";
import { RESPONSES } from "../Utils";
import { formatUrl } from "./common.service";
import { API_HOST } from "../Constant";

axios.defaults.baseURL = API_HOST;




// axios request interceptor
axios.interceptors.request.use(
  (config: any) => {
    //   config.headers["api-access-token"] = token;
    return config;
  },
  (error: any) => {
    return error;
  }
);

// axios response interceptor
axios.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    return error.response;
  }
);

/**HANDLE AXIOS SUCCESS */
function handleSuccess(res) {
  if (res?.status === RESPONSES.SUCCESS || res?.status === RESPONSES.CREATED) {
    res?.data?.message && toaster.success(res?.data?.message);
  } else if (res?.data?.message === "Bad Request") {
    res?.data?.message && toaster.error("Invalid user");
  } else {
    res?.data?.message && toaster.info(res?.data?.message);
  }
}

export const apiCallPost = (url, data, params = {}, showtoaster = false, headers = {}) =>
  new Promise((resolve) => {
    axios
      .post(formatUrl(url, params), data, {
        headers: headers,
      })
      .then((res) => {
        showtoaster && handleSuccess(res);
        resolve(res.data);
      })
      .catch((error) => {
        resolve(null);
      });
  });


/**METHOD FOR SEND API */
export const apiCallGet = (url, data, params = {}, showtoaster = false, headers = {}) =>
  new Promise((resolve) => {
    axios
      .get(formatUrl(url, params), {
        headers: headers,
      })
      .then((res) => {
        showtoaster && handleSuccess(res);
        resolve(res.data);
      })
      .catch((error) => {
        resolve(null);
      });
  });

