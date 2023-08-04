import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
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
import { Subwallet } from "../../../Constant";
import sub from "../../../Assets/Images/sub.jpg";
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

/**CONNECT WALLET MODAL */
const ConnectWallet = () => {
  /**DECLARE VARIABLES */
  const [show, setShow] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>({});
  const [subwalletWalletAddress, setSubwalletWalletAddress] = useState<any>("");

  /**GET STATES FROM STORE */
  const isWalletConnected = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );
  const ReduxwalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );

  const handleClose = () => setShow(false);
  // HANDLING WALLET CONNECTION
  const wallectConnectHandle = async () => {
    if (isWalletConnected === true) {
      setSubwalletWalletAddress(ReduxwalletAddress);
    } else {
      setSubwalletWalletAddress("");
      return
    }
  }

  // USE_EFFECTS
  useEffect(() => {
    setShow(false);
  }, [subwalletWalletAddress]);

  useEffect(() => {
    wallectConnectHandle()
  }, [isWalletConnected]);

  useEffect(() => {
    setConnectionStatus({});
  }, [show]);

  //Wallet connect call for Subwallet
  const connectToWallet = async (wallet) => {
    setConnectionStatus({ wallet, status: "pending" });
    try {
      if (wallet === Subwallet) {
        setTimeout(() => {
          connectSubwallet();
          setConnectionStatus({ wallet, status: "account" });
        }, 2000);
      }
    } catch (error) {
      setConnectionStatus({ wallet, status: "error" });
    }
  };

  const address = '5EsJDhMhj7Zxyjng8qteqzLQxroATMBitEdkudTAn3KECD5a';
  //Fn VALIDATE ASTER WALLET ADDRESS
  const isValidAddressPolkadotAddress = () => {
    try {
      encodeAddress(
        isHex(address)
          ? hexToU8a(address)
          : decodeAddress(address)
      );

      return true;
    } catch (error) {
      return false;
    }
  };

  //Fn CLOSE LOGOUT MODAL
  const handleCloseLogoutModal = async () => {
    await disconnectWallet();
    await handleClose();
    customizeAddress("");
  };

  return (
    <>
      <ButtonCommon
        className={`WltBtn ${subwalletWalletAddress && "WltBtn--connected"}`}
        title={<div className="d-flex align-items-center">
          <span className="me-3">
          <img src={wallet_icon} alt="wallet-icon" />
          </span>  
          {subwalletWalletAddress && isWalletConnected ? customizeAddress(subwalletWalletAddress) : <p>Connect Wallet</p>}
         </div>}
        onClick={() => {
          setShow(true);
        }}
      />

      <CommonModal
        className="connect_wallet"
        show={show}
        onHide={handleClose}
        heading={subwalletWalletAddress ? "Disconnect wallet" : "Connect Wallet"}
        crossBtn
      >
        <div className="connect_options">
          {subwalletWalletAddress ? (
            ""
          ) : (
            <>
              <div
                className={`connect_options_details d-flex align-items-center mb-3 ${connectionStatus?.status === "error" ? "danger" : ""
                  }`}
              >
                {connectionStatus?.status === "pending" && (
                  <Spinner animation="border" />
                )}
                <p className="ms-2">
                  {connectionStatus?.status === "pending"
                    ? "Initializing..."
                    : connectionStatus?.status === "error"
                      ? "Error Connecting"
                      : ""}
                </p>
                {connectionStatus?.status === "error" && (
                  <ButtonCommon
                    onClick={() => connectToWallet("Subwallet")}
                    title="Try Again"
                  />
                )}
              </div>
              <ul>

                <li onClick={() => connectToWallet("Subwallet")}>
                  <span>
                    <img src={sub} alt="" />
                  </span>
                  Sub Wallet
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
