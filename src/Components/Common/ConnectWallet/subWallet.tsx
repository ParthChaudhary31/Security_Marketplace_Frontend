import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import ButtonCommon from "../Button/ButtonCustom";
import {
  connectSubwallet,
  disconnectWallet,
} from "../../../Api/Actions/user.action";
import { customizeAddress } from "../../../Services/common.service";
import Spinner from "react-bootstrap/Spinner";
import wallet_icon from "../../../Assets/Images/wallet.png";
import CommonModal from "../CommonModal/CommonModal";
import "./subWallet.scss";
import { SUBWALLET } from "../../../Constant";
import sub from "../../../Assets/Images/sub.jpg";
import toaster from "../Toast";
import { WALLET_ADDRESS_REQUIRE } from "../../../Constants/AlertMessages/ErrorMessages";

/**CONNECT WALLET MODAL */
const ConnectWallet = () => {
  /**DECLARE VARIABLES */
  const [show, setShow] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>({});
  const [subwalletWalletAddress, setSubwalletWalletAddress] = useState<any>("");

  const [isLoading, setIsLoading] = useState(false);

  /**GET STATES FROM STORE */
  const isWalletConnected :any = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );

  const reduxWalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );

  const handleClose = () => setShow(false);

  const wallectConnectHandle = async () => {
    if (isWalletConnected === true) {
      setSubwalletWalletAddress(reduxWalletAddress);
    } else {
      setSubwalletWalletAddress("");
      return;
    }
  };

  // USE_EFFECT
  useEffect(() => {
    setShow(false);
  }, [subwalletWalletAddress]);

  // USE_EFFECTS
  useEffect(() => {
    wallectConnectHandle();
  }, [isWalletConnected]);

  useEffect(() => {
    setConnectionStatus({});
  }, [show]);


  //Wallet connect call for Subwallet
  const connectToWallet = async (wallet) => {
    if (reduxWalletAddress !== ""){
      setConnectionStatus({ wallet, status: "pending" });
      try {
        if (wallet === SUBWALLET) {
          setIsLoading(true);
          await connectSubwallet();
          setTimeout(() => {
            setConnectionStatus({ wallet, status: "account" });
            setIsLoading(false);
          }, 10000);
        }
      } catch (error) {
        setConnectionStatus({ wallet, status: "error" });
        setIsLoading(false);
      }
    }else{
      toaster.error(WALLET_ADDRESS_REQUIRE);
    }
  };

  const handleCloseLogoutModal = async () => {
    disconnectWallet();
    handleClose();
    setSubwalletWalletAddress("");
  };

  return (
    <>
      <ButtonCommon
        className={`WltBtn ${subwalletWalletAddress && "WltBtn--connected"}`}
        title={
          <div className="d-flex align-items-center">
            <span className="me-3">
              <img src={wallet_icon} alt="wallet-icon" />
            </span>

            {subwalletWalletAddress && isWalletConnected ? (
              customizeAddress(subwalletWalletAddress)
            ) : (
              <p>Connect Wallet</p>
            )}
          </div>
        }
        onClick={() => {
          setShow(true);
        }}
      />

      <CommonModal
        className="connect_wallet"
        show={show}
        onHide={handleClose}
        heading={
          subwalletWalletAddress ? "Disconnect Wallet" : "Connect Wallet"
        }
        crossBtn
      >
        <div className="connect_options">
          {subwalletWalletAddress ? (
            ""
          ) : (
            <>
              <div
                className={`connect_options_details d-flex align-items-center mb-3 ${
                  connectionStatus?.status === "error" ? "danger" : ""
                }`}
              >
                {isLoading && <Spinner animation="border" />}{" "}
                {/* Show loading spinner */}
                <p className="ms-2">
                  {isLoading
                    ? "Initializing..."
                    : connectionStatus?.status === "error"
                    ? "Error Connecting"
                    : ""}
                </p>
                {connectionStatus?.status === "error" && (
                  <ButtonCommon
                    onClick={() => connectToWallet(SUBWALLET)}
                    title="Try Again"
                    disabled={isLoading}
                  />
                )}
              </div>
              <ul>
                <li>
                  <button
                    onClick={() => connectToWallet(SUBWALLET)}
                    disabled={isLoading}
                    className="connect_btn"
                  >
                    <span>
                      <img src={sub} alt="" />
                    </span>
                    Sub Wallet
                  </button>
                </li>
              </ul>
            </>
          )}
          <div className="add_new text-center">
            {subwalletWalletAddress ? (
              <ButtonCommon
                className="btn-danger mx-auto"
                onClick={handleCloseLogoutModal}
                title="Disconnect"
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default ConnectWallet;
