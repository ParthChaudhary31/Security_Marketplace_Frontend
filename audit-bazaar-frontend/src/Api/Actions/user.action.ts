import toaster from "../../Components/Common/Toast";
import {
  Subwallet,
} from "../../Constant";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import {
  setIsWalletConnected,
  setWalletAddress,
  setWalletType,
} from "../../Redux/authenticationData/authenticationData";
import store from "../../Redux/store";
import { WALLET_CONNECTED, WALLET_DISCONNECTED } from "../../Constants/AlertMessages/SuccessMessages";
import { WALLET_ADDRESS_REQUIRE, WALLET_CONNECTION_UNSUCCESSFUL } from "../../Constants/AlertMessages/ErrorMessages";

/**DECLARE ETHEREUM TYPE */
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**CONNECT WITH SUBWALLET */
export const connectSubwallet = async () => {
  try {
    const allInjected = await web3Enable("subwallet-js");
    const allAccounts = await web3Accounts();
    if (allAccounts[0]?.address) {
      if(allAccounts[0]?.address){
        store.dispatch(setWalletAddress(allAccounts[0]?.address));
        store.dispatch(setIsWalletConnected(true)); 
        store.dispatch(setWalletType(Subwallet));
        store.dispatch(setIsWalletConnected(true));
        toaster.success(WALLET_CONNECTED);
      }
      else{
        toaster.error(WALLET_CONNECTION_UNSUCCESSFUL);
        return  
      }
    } else if (allInjected.length === 0) {
      window.open("https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn")
    }
  } catch (error) {
    console.log(error);
  }
};

/**DISCONNECT WALLET */
export const disconnectWallet = () => {
  try {
    store.dispatch(setWalletType(""));
    store.dispatch(setWalletAddress(""));
    store.dispatch(setIsWalletConnected(false))
    toaster.success(WALLET_DISCONNECTED);
  } catch (error: any) {
    return toaster.error(error.message);
  }
};
