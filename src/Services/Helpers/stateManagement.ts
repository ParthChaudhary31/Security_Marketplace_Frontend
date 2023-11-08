import { resetLoaderDataSlice } from "../../Redux/loader/loader";
import { resetUserDataSlice, setIsWalletConnected } from "../../Redux/authenticationData/authenticationData";
import store from "../../Redux/store";
import packageJson from "../../../package.json";
import { resetAuthenticationDataSlice } from "../../Redux/userData/userData";
import { logout } from "../../Api/Actions/user.action";
import { UserData } from "../../Constants/Interfaces/Authentication/UserData";

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
    }
    if (!react_version) {
      resetRedux();
      localStorage.clear();
    }
    localStorage.setItem("react_version", version);
  } catch (error) {
    console.log("Error in versionManager =>", error);
  }
};
//handle logout
export const handleLogout = async (navigate:any,userData:UserData) => {
  try {
    const result= await logout({ emailAddress: userData?.emailAddress });
    if(result?.status === 200){;
      store.dispatch(setIsWalletConnected(false));
      localStorage.clear();
    await versionManager();
    navigate("/");
    }
    else if (result?.status === 401) {
      localStorage.clear();
      await versionManager();
      
    navigate("/");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
