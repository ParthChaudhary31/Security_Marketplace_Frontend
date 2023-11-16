import toaster from "../../Components/Common/Toast";
import { setErrorMessage } from "../../Redux/authenticationData/authenticationData";
import store from "../../Redux/store";

//to check error is user denied or not
export const errorCheck = async (error: any) => {
  if (error?.message?.includes("Rejected by user")) {
    store?.dispatch(setErrorMessage("The user denied the transaction."));
  } else if (
    error?.message?.includes(
      "Inability to pay some fees" || "account balance too low"
    )
  ) {
    store?.dispatch(
      setErrorMessage("Insufficient Balance For Gas Fee In Your Account")
    );
  } else if (
    error?.message?.includes("No response received from RPC endpoint in 60s")
  ) {
    store?.dispatch(setErrorMessage("RPC Error.Please Try After Some Time"));
  } else if (error?.message?.includes("Insufficient Balance In Your Account")) {
    store?.dispatch(setErrorMessage("Insufficient Balance In Your Account"));
  } else if (
    error?.message?.includes(
      "You have insufficient balance in your account for gas charges"
    )
  ) {
    store?.dispatch(setErrorMessage("Insufficient Stable Coin Funds"));
  } else {
    toaster.error("Something Went Wrong");
  }
};
