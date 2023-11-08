import Swal from "sweetalert2";
import Web3 from "web3";
import toaster from "../../Components/Common/Toast";
import {
  APIURL,
  CHAIN_ID,
  EXPLORAR_LINK,
  NETWORK_DECIMALS,
  NETWORK_NAME,
  NETWORK_SYMBOL,
  POLKADOT_JS,
  RPC_URL,
  SUBWALLET,
  SUBWALLET_JS,
} from "../../Constant";
import { apiCallPost } from "../../Services/axios.service"; //storeInstance
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import {
  setIsWalletConnected,
  setWalletAddress,
  setWalletType,
} from "../../Redux/authenticationData/authenticationData";
import store from "../../Redux/store";
import {
  WALLET_CONNECTED,
  WALLET_DISCONNECTED,
} from "../../Constants/AlertMessages/SuccessMessages";
import { WALLET_ADDRESS_MISMATCH } from "../../Constants/AlertMessages/ErrorMessages";
import { setUserBalance } from "../../Redux/userData/userData";
import { userNativeTokenBalance } from "../../Services/contract.service";
import { AUDIT_POST_STATUS_TYPES } from "../../Constants/AuditPost/AuditPostTypes";

/**DECLARE ETHEREUM TYPE */
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**CHECK WHETHER METAMASK IS INSTALLED OR NOT */
export const isMetaMaskInstalled = async () => {
  const { ethereum } = window;
  const result = await Boolean(ethereum);
  return result;
};

const { ethereum }: any = window;
if (ethereum) {
  ethereum.on("networkChanged", function () {
    approveNetwork();
  });

  ethereum.on("accountsChanged", function (account: any) {
    if (!account.length) {
      Swal.fire({
        icon: "info",
        title: "Wallet Disconnected",
        text: "Please connect wallet to continue",
        showCancelButton: false,
        confirmButtonText: "Ok",
      });
    }
  });
}

/**CONNECT WITH METAMASK */
export const connectmetamask = () => {
  return (dispatch: DispatchType) =>
    new Promise(async (resolve, reject) => {
      /**CHECK METAMASK IN INSTALLED OR NOT */
      const installed = await isMetaMaskInstalled();
      try {
        let address: any;
        if (installed) {
          const { ethereum } = window;

          /**VERIFY METAMASK HAVE OUR NETWORK AND METAMASK SHOULD BE ON OUR NETWORK */
          let validNetwork: any = await approveNetwork();
          if (validNetwork) {
            /**METHOD CALL WHEN ACCOUNT CHANGED IN METAMASK */
            ethereum.on("accountsChanged", async function (accounts: string[]) {
              address = accounts[0];
              /**SAVE WALLET ADDRESS AND WALLET TYPE IN REDUX */
              // dispatch(walletType("MetaMask"));
              return address;
            });

            /**METHOD CALL WHEN NETWORK CHANGED IN METAMASK */
            // ethereum.on('chainChanged', function (networkId: number) {
            //     setTimeout(function () { window.location.reload(); }, 1000);
            // })

            /**GET ACCOUNT DETAILS */
            const accounts = await ethereum.request({
              method: "eth_requestAccounts",
            });
            address = accounts[0];

            /**SAVE WALLET ADDRESS AND WALLET TYPE IN REDUX */
            // dispatch(walletType("MetaMask"));
            // resolve(address);
            // return dispatch(walletAddress(address));
          } else {
            reject(false);
          }
        } else {
          /**IF METAMASK NOT INSTALLED */
          reject(false);
          return toaster.error("Please install Metamask.");
        }
      } catch (error: any) {
        reject(error);
        return toaster.error(error.message);
      }
    });
};

/**CONNECT WITH SUBWALLET */

const extensionLinks = {
  Chrome:
    "https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
  Firefox: "https://addons.mozilla.org/en-US/firefox/addon/subwallet/",
  Edge: "https://microsoftedge.microsoft.com/addons/detail/subwallet/gkjgmpkbcbmfncealocihkpoabhmoapm",
  Brave:
    "https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
  InternetExplorer: "https://example.com/ie-link",
  Chromium: "https://example.com/chromium-link",
  Opera:
    "https://addons.opera.com/en/extensions/details/subwallet-polkadot-wallet/",
  DuckDuckGo: "https://example.com/duckduckgo-link",
  Default: "https://www.subwallet.app/download.html",
};

const userAgent = navigator.userAgent;
let browserName = "Other";

for (const browser in extensionLinks) {
  if (userAgent.includes(browser)) {
    browserName = browser;
    break;
  }
}

const checkSubwalletExtension = () => {
  if (browserName in extensionLinks) {
    toaster.error("Please install Subwallet extension first.");
    setTimeout(() => {
      window.open(extensionLinks[browserName]);
    }, 2000);
  } else {
    toaster.error(
      "Please use a supported browser and install Subwallet extension."
    );
    setTimeout(() => {
      window.open(extensionLinks.Default); // Fallback to the default link for unsupported browsers
    }, 2000);
  }
};

export const connectSubwallet = async () => {
  try {
    const walletAddressUserSaved: any = await store?.getState()
      .authenticationDataSlice.walletAddress;
    const allInjected = await web3Enable(SUBWALLET_JS);
    const allAccounts = await web3Accounts();
    if (allAccounts[0]?.address) {
      const userAccount = allAccounts[0]?.address;
      const userWalletBalance: any = await userNativeTokenBalance(userAccount);
      const userWalletBalanceReadable: any = userWalletBalance.toHuman();
      const ContractUserValue: any = userWalletBalanceReadable?.Ok;
      const userBalanceDecimalValue = BigInt(
        ContractUserValue.replace(/,/g, "").replace(/^0+/, "")
      );
      let userBalanceValue = userBalanceDecimalValue.toString();
      userBalanceValue = userBalanceValue.replace("n", "");
      if (walletAddressUserSaved === userAccount) {
        store.dispatch(setWalletAddress(userAccount));
        store.dispatch(setUserBalance(userBalanceValue));
        store.dispatch(setIsWalletConnected(true));
        store.dispatch(setWalletType(SUBWALLET));
        toaster.success(WALLET_CONNECTED);
      } else {
        toaster.error(WALLET_ADDRESS_MISMATCH);
        return;
      }
    }
    if (
      allInjected.some(
        ({ name }) => name === POLKADOT_JS || name === SUBWALLET_JS
      )
    ) {
    } else {
      checkSubwalletExtension();
    }
  } catch (error) {
    console.log("connectSubwallet error", error);
  }
};

/**DISCONNECT WALLET */
export const disconnectWallet = () => {
  try {
    store?.dispatch(setWalletType(""));
    store?.dispatch(setIsWalletConnected(false));
    store?.dispatch(setUserBalance(""));
    toaster.success(WALLET_DISCONNECTED);
  } catch (error: any) {
    return toaster.error(error.message);
  }
};

/**VERIFY METAMASK HAVE OUR NETWORK AND METAMASK SHOULD BE ON OUR NETWORK */
export const approveNetwork = async () => {
  return new Promise(async (resolve, reject) => {
    const { ethereum } = window;
    /**IF METAMASK IS ON DIFFRENT NETWORK */
    if (ethereum.networkVersion !== CHAIN_ID) {
      try {
        /**SWITCH METAMASK TO OUR NETWORK */

        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(CHAIN_ID) }],
        });
        resolve(true);
      } catch (err: any) {
        /**IF METAMASK DO'NT HAVE OUR NETWORK. ADD NEW NETWORK */
        if (err.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: Web3.utils.toHex(CHAIN_ID),
                chainName: NETWORK_NAME,
                nativeCurrency: {
                  name: NETWORK_NAME,
                  symbol: NETWORK_SYMBOL,
                  decimals: NETWORK_DECIMALS,
                },
                rpcUrls: [RPC_URL],
                blockExplorerUrls: [EXPLORAR_LINK],
              },
            ],
          });
          resolve(true);
        } else {
          resolve(err);
        }
      }
    } else {
      resolve(true);
    }
  });
};

// USER_LOGIN
export const userLogin = async (data: any) => {
  const { emailAddress, password, dispatch } = data;
  try {
    let result: any = await apiCallPost(
      APIURL["USER_LOGIN"],
      {
        emailAddress: emailAddress,
        password: password,
        dispatch,
      },
      {},
      false,
      {}
    );
    if (result?.data?.twoFactorAuthenticationStatus === true) {
    } else if (result?.status === 200) {
      toaster.success(result?.message);
    } else if (result?.status === 400) {
      toaster.error(result?.message);
    } else if (result?.status === 500) {
      toaster.error(result?.message);
    }
    return result;
  } catch (error) {
    console.log("error userlogin", error);
  }
};

// USER_REGISTER
export const registerUser = async (data: any) => {
  const {
    firstName,
    lastName,
    emailAddress,
    password,
    confirmPassword,
    dispatch,
  } = data;
  try {
    let result: any = await apiCallPost(
      APIURL["USER_REGISTER"],
      {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password,
        confirmPassword: confirmPassword,
        dispatch,
      },
      {},
      true,
      {}
    );

    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

// User claim
export const updateUserClaim = async (data: any) => {
  const { emailAddress, postID } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  try {
    const result: any = await apiCallPost(
      APIURL["UPDATE_CLAIM"],
      {
        emailAddress,
        postID,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};
// Update User Profile
export const updateUserProfile = async (form: any) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["UPDATE_PROFILE"],
      form,
      {},
      true,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//pre USER_AUDIT_REQUEST
export const registerAudit = async (data: any) => {
  const {
    emailAddress,
    gitHub,
    auditType,
    offerAmount,
    estimatedDelivery,
    description,
    socialLink,
    salt,
  } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["REGISTER_AUDIT"],
      {
        emailAddress,
        gitHub,
        auditType,
        offerAmount,
        estimatedDelivery,
        description,
        socialLink,
        salt,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//USER_AUDIT_REQUEST
export const getMyBio = async (data: any) => {
  const { emailAddress } = store?.getState().userDataSlice;

  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["GET_USER_INFO"],
      {
        emailAddress: emailAddress,
      },
      {},
      false,
      headers
      // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//GET USER ALL AUDIT REQUEST

export const getAllAuditDetails = async (
  data: any,
  page: number,
  limit: number,
  status: AUDIT_POST_STATUS_TYPES,
  offerAmountLower: number,
  offerAmountHigher: number,
  requiredAuditType: number
) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  const queryParams = `?limit=${limit}&page=${page}&search=${status}&offerAmountLower=${offerAmountLower}&offerAmountHigher=${offerAmountHigher}&requiredAuditType=${requiredAuditType}`;
  try {
    const result: any = await apiCallPost(
      APIURL["GET_DETAILS_OF_ALL_AUDITS"] + queryParams,
      {
        emailAddress: data,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

export const updatePassword = async (data: any) => {
  const { emailAddress, oldPassword, newPassword, confirmPassword } = data;

  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`,
  };

  try {
    const result: any = await apiCallPost(
      APIURL["UPDATE_PASSWORD"],
      {
        emailAddress,
        oldPassword,
        newPassword,
        confirmPassword,
      },
      {},
      true,
      headers
    );
    if (result?.status === 200) {
      return result;
    } else if (result?.status === 400) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};
export const getAllAuditDetailsForPublic = async (
  data: any,
  page: number,
  limit: number,
  offerAmountLower?: any,
  offerAmountHigher?: any,
  requiredAuditType?: any
) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  const queryParams = `?limit=${limit}&page=${page}&offerAmountLower=${offerAmountLower}&offerAmountHigher=${offerAmountHigher}&requiredAuditType=${requiredAuditType}`;

  try {
    const result: any = await apiCallPost(
      APIURL["GET_DETAILS_OF_ALL_AUDITS_PUBLIC"] + queryParams,
      {
        emailAddress: data,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAllAuditFullDetailsForPublic = async (data: any, id: any) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["GET_DETAILS_OF_AUDIT"],
      {
        emailAddress: data,
        postID: id,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//User Audit Bidding POST
export const postAuditBidding = async (data: any) => {
  const {
    emailAddress,
    posterEmailAddress,
    estimatedAmount,
    estimatedDelivery,
    postID,
  } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["BIDDING_REQUEST"],
      {
        emailAddress,
        posterEmailAddress,
        estimatedAmount,
        estimatedDelivery,
        postID,
      },
      {},
      true,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//User Audit Bidding GET
export const getAuditBidding = async (data: any) => {
  const { emailAddress, postID } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["BIDS_OF_MY_REQUEST"],
      {
        emailAddress,
        postID,
      },
      {},
      false,
      headers // Pass the headers wApi integration3ith the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

// Bidding status
export const updateAuditorId = async (data: any) => {
  const { emailAddress, postID, auditorEmail, salt } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["UPDATE_AUDITOR_ID"],
      {
        emailAddress,
        postID,
        auditorEmail,
        salt,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

// Bidding status
export const updateSalt = async (data: any) => {
  const { emailAddress, postID, salt } = data;

  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["UPDATE_SALT"],
      {
        emailAddress,
        postID,
        salt,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//Update audit status after bidder selected
export const updateAuditStatus = async (data: any) => {
  const { emailAddress, postID, txHash, status, salt } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["UPDATE_AUDIT_STATUS"],
      {
        emailAddress,
        postID,
        status: status,
        txHash,
        salt,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//Update Bid status after bidder selected
export const updateBidStatus = async (data: any) => {
  const { emailAddress, auditorEmail, postID, status } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["UPDATE_BID_STATUS"],
      {
        emailAddress,
        auditorEmail,
        postID,
        status,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//submit audit
export const submitAuditReportUser = async (form: any) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `${accessToken}`,
  };
  try {
    const result: any = await apiCallPost(
      APIURL["SUBMIT_AUDIT_REPORT"],
      form,
      {},
      false,
      headers
    );
    if (result?.status === 200) {
      // toaster.success(result?.message);
    } else if (result?.status === 400) {
      toaster.error(result?.message);
    } else if (result?.status === 500) {
      toaster.error(result?.message);
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};

// 2FA Authantication
export const TwoFA = async (emailAddress: any) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`,
  };
  try {
    const result: any = await apiCallPost(
      APIURL["TWO_FACTOR_AUTHANTICATION"],
      {
        emailAddress: emailAddress,
      },
      {},
      false,
      headers
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

// 2FA Varification

export const verifytwoFactor = async (
  secret: any,
  otp: string,
  emailAddress: any
) => {
  const otpAsNumber = Number(otp);

  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`,
  };
  try {
    const result: any = await apiCallPost(
      APIURL["TWO_FACTOR_VERIFY"],
      {
        secret: secret,
        otp: otpAsNumber,
        emailAddress: emailAddress,
      },
      {},
      false,
      headers
    );

    if (result?.status === 200) {
      toaster.success(result?.message);
    } else if (result?.status === 400) {
      toaster.error(result?.message);
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

// 2FA Login Varification

export const logintwoFactorAuthentication = async (
  otp: string,
  emailAddress: any
) => {
  const otpAsNumber = Number(otp);
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`,
  };
  try {
    const result: any = await apiCallPost(
      APIURL["LOGIN_TWO_FACTOR_VERIFICATION"],
      {
        otp: otpAsNumber,
        emailAddress: emailAddress,
      },
      {},
      false,
      headers
    );
    if (result?.status === 200) {
      toaster.success(result?.message);
    } else if (result?.status === 400) {
      toaster.error(result?.message);
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};
// 2FA Disable

export const disableTwoFactor = async (otp: string, emailAddress: any) => {
  const otpAsNumber = Number(otp);
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`,
  };
  try {
    const result: any = await apiCallPost(
      APIURL["DISABLE_TWO_FACTOR"],
      { otp: otpAsNumber, emailAddress: emailAddress },
      {},
      false,
      headers
    );
    if (result?.status === 200) {
      toaster.success(result?.message);
    } else if (result?.status === 400) {
      toaster.error(result?.message);
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};
// check 2FA Status
export const checkTwoFactorStatus = async () => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`,
  };
  try {
    const result: any = await apiCallPost(
      APIURL["CHECK_TWO_FACTOR_STATUS"],
      {},
      {},
      false,
      headers
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const logout = async (data: any) => {
  const { emailAddress } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  try {
    let result: any = await apiCallPost(
      APIURL["LOGOUT"],
      {
        emailAddress: emailAddress,
      },
      {},
      false,
      headers
    );
    if (result?.status === 200) {
      toaster.success(result?.message);
      return result;
    } else if (result?.status === 401) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteBidderBid = async (data: any) => {
  const { emailAddress, postID, bidderToDecline } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["DELETE_BIDDER_BID"],
      {
        emailAddress,
        postID,
        bidderToDecline,
      },
      {},
      true,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

export const extendTimeLinePost = async (data: any) => {
  const { emailAddress, postID, isAccepted } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["EXTEND_TIMELINE_POST"],
      {
        emailAddress,
        postID,
        isAccepted,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    } else if (result?.status === 400) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};
export const setExtendTimeLinePost = async (data: any) => {
  const {
    emailAddress,
    postID,
    reason,
    proposedAmount,
    proposedDeliveryTime,
    isAccepted,
  } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["SET_EXTEND_TIMELINE_POST"],
      {
        emailAddress,
        postID,
        reason,
        proposedAmount,
        proposedDeliveryTime,
        isAccepted,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    } else if (result?.status === 400) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

//registerPostAudit
export const confirmPostAudit = async (data: any) => {
  const { txHash, salt, currentAuditId } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  try {
    const result: any = await apiCallPost(
      APIURL["CONFIRM_POST"],
      {
        txHash,
        salt,
        currentAuditId,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};
//submitAuditRepost
export const submitAuditReport = async (data: any) => {
  const { emailAddress, postID, txHash, salt } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  try {
    const result: any = await apiCallPost(
      APIURL["CONFIRM_SUBMIT_AUDIT"],
      {
        emailAddress,
        postID,
        txHash,
        salt,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

// voting table listing
export const tableListing = async (
  emailAddress: any,
  page: number,
  limit: number
) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  try {
    let result: any = await apiCallPost(
      APIURL["ARBITER_TABLE_LISTING"],
      { emailAddress: emailAddress },
      { page, limit },

      false,
      headers
    );

    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

// voting table listing
export const arbitorVoting = async (
  emailAddress: any,
  postID: number,
  vote: any,
  voterId: any
) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  try {
    let result: any = await apiCallPost(
      APIURL["ARBITER_VOTE"],
      { emailAddress: emailAddress, postID, vote, voteType: voterId },
      {},
      false,
      headers
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const removeProfilePicture = async (emailAddress: any) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  try {
    let result: any = await apiCallPost(
      APIURL["REMOVE_PROFILE_PICTURE"],
      { emailAddress: emailAddress },
      {},
      true,
      headers
    );

    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

export const viewPostForArbitor = async (data: any) => {
  const { emailAddress, postID, patron } = data;
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;
  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["VIEW_POST_FOR_ARBITOR"],
      {
        emailAddress,
        postID,
        patron,
      },
      {},
      false,
      headers // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

export const selectArbiters = async (data: any) => {
  const { emailAddress, postID, reason } = data;

  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["SELECT_ARBITORS"],
      {
        emailAddress,
        postID,
        reason,
      },
      {},
      false,
      headers
      // Pass the headers with the token
    );
    if (result?.status === 200) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

export const myBids = async (emailAddress: any,page:number,limit:number) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };
  const queryParams = `?limit=${limit}&page=${page}`;

  try {
    const result: any = await apiCallPost(
      APIURL["MY_BIDS"] + queryParams,
      {
        emailAddress,
      },
      {},
      false,
      headers
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};
export const transactionHistory = async (
  emailAddress: any,
  page: number,
  limit: number
) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  const queryParams = `?limit=${limit}&page=${page}`;
  try {
    const result: any = await apiCallPost(
      APIURL["TRANSACTION_HISTORY"] + queryParams,
      {
        emailAddress,
      },
      {},
      false,
      headers
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};
export const transactionRegister = async (
  emailAddress: any,
  txHash: any,
  timestamp: any,
  transactionType: any
) => {
  const accessToken = store?.getState().authenticationDataSlice?.jwtToken;

  const headers = {
    "Content-Type": "application/json",
    authorization: `${accessToken}`, // Include the token in the Authorization header
  };

  try {
    const result: any = await apiCallPost(
      APIURL["TRANSACTION_REGISTER"],
      {
        emailAddress,
        txHash,
        timestamp,
        transactionType,
      },
      {},
      false,
      headers
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};
