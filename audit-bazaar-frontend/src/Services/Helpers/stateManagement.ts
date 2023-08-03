import { resetLoaderDataSlice } from "../../Redux/loader/loader";
import { resetUserDataSlice } from "../../Redux/authenticationData/authenticationData";
import store from "../../Redux/store";
import packageJson from "../../../package.json";
import { resetAuthenticationDataSlice } from "../../Redux/userData/userData";

const resetRedux = () => {
  store.dispatch(resetUserDataSlice(""));
  store.dispatch(resetAuthenticationDataSlice(""));
  store.dispatch(resetLoaderDataSlice(""));
};

export const versionManager = async () => {
  try {
    const version = packageJson.version;
    const react_version = localStorage.getItem("react_version");
    if (react_version && version !== react_version) {
      resetRedux();
      localStorage.clear();
      window.location.reload();
    }
    if (!react_version) {
      resetRedux();
      localStorage.clear();
      window.location.reload();
    }
    localStorage.setItem("react_version", version);
  } catch (error) {
    console.log("Error in versionManager =>", error);
  }
};
