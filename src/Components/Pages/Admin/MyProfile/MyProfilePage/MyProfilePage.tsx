import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./MyProfilePage.scss";
import { useLocation } from "react-router-dom";
import ButtonCustom from "../../../../Common/Button/ButtonCustom";
import DashboardListing from "../../Dashboard/DashboardListing/DashboardListing";
import { useSelector } from "react-redux";
import defaultUserIcon from "../../../../../Assets/Images/defaultUserIcon.png";
import {
  deleteBidderBid,
  extendTimeLinePost,
  getAuditBidding,
  transactionRegister,
  updateAuditStatus,
  updateAuditorId,
  updateBidStatus,
} from "../../../../../Api/Actions/user.action";
import moment from "moment";
import {
  AcceptBidForPostTxn,
  ExtendTimelineTxnForPatron,
} from "../../../../../Services/contract.service";
import toaster from "../../../../Common/Toast";
import {
  DECLINE_SUCCESSFULLY,
  WALLET_BALANCE_LOW,
  WALLET_CONNECTION_REQUIRE,
} from "../../../../../Constants/AlertMessages/ErrorMessages";
import {
  BID_TOKEN_DECIMAL,
  CONFIRM,
  ERROR_TXN,
  IN_PROGRESS,
  PENDING_TXN,
  SUCCESS_TXN,
  TRANSACTION_PROCESS,
  TRANSACTION_SUCCESS,
  baseUrl,
  isImageFile,
} from "../../../../../Constant";
import {
  exponentialToDecimal,
  makeId,
} from "../../../../../Services/Helpers/mathhelper";
import TransactionModal from "../../../../Common/SubmitRequestModal/transaction-modal/transaction-modal/TransactionModal";
import {
  userBalanceCheck,
  validateEscrowBalance,
} from "../../../../../Services/Helpers/accountValidCheck";
import {
  setStatusExtendedForPatron,
  setUserBalance,
} from "../../../../../Redux/userData/userData";
import store from "../../../../../Redux/store";
import ProfileBioModal from "../../../../Common/CommonModal/ProfileBioModal/ProfileBioModal";
import {
  setErrorMessage,
  setPatronAccepted,
} from "../../../../../Redux/authenticationData/authenticationData";
import {
  ACCEPT_BID_FOR_POST,
  EXTENDED_POST_BY_PATRON,
} from "../../../../../Constants/TransactionTypes/TransactionTypes";
import { errorCheck } from "../../../../../Services/Helpers/errorServices";

const MyProfilePage = () => {
  const location = useLocation();
  const { postID } = location.state;
  const [biddingRequest, setBiddingRequest] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [doneDeleteBid, setDoneDeleteBid] = useState<any>([false]);
  const [isPatron, setIsPatron] = useState<any>([]);
  const [closeMdoal, setcloseMdoal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });
  const [confirmBidData, setConfirmBidData] = useState<any>();
  const [crossIcon, setCrossIcon] = useState<any>(false);
  const [bidAccepted, setBidAccepted] = useState<any>(false);
  const [showNew, setShowNew] = useState(false);
  const handleCloseNew = () => setShowNew(false);
  const handleShowNew = () => setShowNew(true);

  const userEmail = useSelector(
    (state: any) => state?.userDataSlice.emailAddress
  );
  const reduxWalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  const isWalletConnected: any = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );
  const extendForPatron = useSelector(
    (state: any) => state?.authenticationDataSlice?.statusExtendedForPatron
  );
  const convertEpochToDate = (epochTimestamp: number) => {
    return moment.unix(Number(epochTimestamp / 1000)).format("DD/MM/YYYY");
  };

  const [show, setShow] = useState(false);
  const onHide = () => setShow(false);
  const modalShow = () => setShow(true);

  const modalDataFunction = (data: any) => {
    setConfirmBidData(data);

    modalShow();
  };

  const bidderUser = async () => {
    try {
      const biddingResult = await getAuditBidding({
        emailAddress: userEmail,
        postID: postID,
      });
      if (biddingResult?.status === 200) {
        const updatedResult = await biddingResult?.data?.map((item: any) => {
          item.postedAt = moment(item.postedAt).format("DD/MM/YYYY");
          const EpochToNormal = convertEpochToDate(item?.estimatedDelivery);
          item.estimatedDelivery = EpochToNormal;
          return item;
        });
        setBiddingRequest(updatedResult);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    bidderUser();
  }, [doneDeleteBid, bidAccepted]);

  // call loader handleAuditRequest
  const handleAcceptBid = async (
    postId: any,
    bidderAddr: any,
    estimatedAmount: any,
    estimatedDelivery: any,
    bidderEmail: any
  ) => {
    if (isWalletConnected) {
      try {
        handleShowNew();
        setModalData({
          heading: "Accept Bidder",
          bodyText: TRANSACTION_PROCESS,
          status: PENDING_TXN,
          txHash: null,
        });
        const response: any = await AcceptBid(
          postId,
          bidderAddr,
          estimatedAmount,
          estimatedDelivery,
          bidderEmail
        );
        if (response?.status === 200) {
          setModalData({
            heading: TRANSACTION_SUCCESS,
            bodyText: response?.message,
            status: SUCCESS_TXN,
            txHash: response?.txHash,
          });
          setBidAccepted(true);
          setCrossIcon(true);
          store?.dispatch(setPatronAccepted(true));
        } else {
          const errorMessage: any =
            store?.getState()?.authenticationDataSlice?.errorMessage;
          setModalData({
            heading: "Accept Bidder ",
            bodyText: errorMessage ? errorMessage : "Accept Bidder Failed",
            status: ERROR_TXN,
            txHash: null,
          });
        }
        store?.dispatch(setErrorMessage(""));
      } catch (error) {
        console.error(error);
      }
    } else {
      toaster.error(WALLET_CONNECTION_REQUIRE);
    }
  };

  //Accept bid API
  const AcceptBid = async (
    postId: any,
    bidderAddr: any,
    estimatedAmount: any,
    estimatedDelivery: any,
    bidderEmail: any
  ) => {
    const userBalDecimalValue: any = await userBalanceCheck(reduxWalletAddress);
    store?.dispatch(setUserBalance(userBalDecimalValue)); //balance update while txn
    try {
      let saltx = await makeId(10);
      const result = await updateAuditorId({
        emailAddress: userEmail,
        postID: postId,
        auditorEmail: bidderEmail,
        salt: saltx,
      });
      if (result?.status === 200) {
        const escrowBalance = await validateEscrowBalance(
          result?.data?.currentAuditId,
          reduxWalletAddress,
          estimatedAmount
        );
        if (escrowBalance === false) {
          errorCheck({message:WALLET_BALANCE_LOW});
          return;
        }
        const formattedDate = moment(estimatedDelivery, "DD/MM/YYYY");
        let AuditEpoch = formattedDate?.unix();
        AuditEpoch = AuditEpoch * 1000;
        let currentEpoch: any = Date.now();
        currentEpoch = parseInt(currentEpoch);
        // //epoch difference
        const EpochTxn: any = AuditEpoch - currentEpoch;
        estimatedAmount = estimatedAmount * 10 ** BID_TOKEN_DECIMAL;
        estimatedAmount = exponentialToDecimal(estimatedAmount);
        //txn call
        let acceptBidResult: any;
        try {
          acceptBidResult = await AcceptBidForPostTxn(
            {
              userAddress: reduxWalletAddress,
              bidAmount: estimatedAmount,
              estimatedDelivery: EpochTxn,
              currentAuditId: result?.data?.currentAuditId,
            },
            bidderAddr
          );
        } catch (error) {
          console.log(error);
        }
          //updateAuditStatus
          let updateAuditResult: any;
          if (acceptBidResult?.isFinalized === true) {
             try {
               updateAuditResult = await updateAuditStatus({
                emailAddress: userEmail,
                postID: postId,
                txHash: acceptBidResult?.txHash,
                status: IN_PROGRESS,
                salt: saltx,
              });
            } catch (error) {
              console.log(error);
            }
          }
          
          let updateBidresult: any;
          if (updateAuditResult?.status === 200) {
            try {
              updateBidresult = await updateBidStatus({
                emailAddress: userEmail,
                auditorEmail: bidderEmail,
                postID: postId,
                status: CONFIRM,
              });
              await transactionRegisterForAcceptBid();
            } catch (error) {
              console.log(error);
            }
          }
        return {
          message: updateBidresult?.message,
          status: updateBidresult?.status,
          txHash: acceptBidResult?.txHash,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPatron = async (value: any) => {
    setIsPatron(value);
    setShowModal(true);
  };
  const extendedTimeLineForPatron = async (e: any) => {
    if (isWalletConnected) {
      try {
        handleShowNew();
        setModalData({
          heading: "Extend Timeline Request",
          bodyText: TRANSACTION_PROCESS,
          status: PENDING_TXN,
          txHash: null,
        });
        const response: any = await handleExtendedForPatron();
        if (response?.status === 200) {
          setModalData({
            heading: TRANSACTION_SUCCESS,
            bodyText: "Extension Request Accepted Successfully.",
            status: SUCCESS_TXN,
            txHash: response?.txHash,
          });
          await transactionRegisterForExtendedByPatron();
          setcloseMdoal(true);
        } else {
          const errorMessage: any =
            store?.getState()?.authenticationDataSlice?.errorMessage;
          setModalData({
            heading: "Transaction Failed.",
            bodyText: errorMessage ? errorMessage : "Extension Request Failed",
            status: ERROR_TXN,
            txHash: null,
          });
        }
        store?.dispatch(setErrorMessage(""));
      } catch (error) {
        console.error(error);
      }
    } else {
      toaster.error(WALLET_CONNECTION_REQUIRE);
    }
  };
  const handleExtendedForPatron = async () => {
    const postID = isPatron?.postID;
    const patronEmail = isPatron?.emailAddress;
    try {
      const result: any = await ExtendTimelineTxnForPatron({
        emailAddress: patronEmail,
        postID: postID,
        userAddress: reduxWalletAddress,
        isAccepted: true,
        currentAuditId: isPatron?.currentAuditId,
      });

      if (result?.isFinalized === true) {
        const modalData: any = await extendTimeLinePost({
          emailAddress: patronEmail,
          postID: postID,
          isAccepted: true,
        });
        return {
          status: modalData?.status,
          txHash: result?.txHash,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  const extendTimeLineForPatron = async () => {
    setcloseMdoal(true);
    const result: any = await extendTimeLinePost({
      emailAddress: isPatron?.emailAddress,
      postID: postID,
      isAccepted: false,
    });
    if (result?.status === 200) {
      store.dispatch(setStatusExtendedForPatron(!extendForPatron));
      toaster.success("Extended Request Decline successfully");
    }
  };

  const transactionRegisterForAcceptBid = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForAcceptBidByPatron =
        store.getState().userDataSlice?.transactionHashForAcceptBid;
      const result: any = await transactionRegister(
        userEmail,
        txnHashForAcceptBidByPatron?.toString(),
        time,
        ACCEPT_BID_FOR_POST
      );

      if (result?.status === 200) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const transactionRegisterForExtendedByPatron = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForExtendByPatronLatest =
        store.getState().userDataSlice?.transactionHashForExtendedForPatron;
      const result: any = await transactionRegister(
        userEmail,
        txnHashForExtendByPatronLatest?.toString(),
        time,
        EXTENDED_POST_BY_PATRON
      );
      if (result?.status === 200) {
        store.dispatch(setStatusExtendedForPatron(!extendForPatron));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // // deleteBid
  const deleteBid = async (Pemail: any, postId: any, Aemail: any) => {
    try {
      const deleteBidderBidNow = await deleteBidderBid({
        emailAddress: Pemail,
        postID: postId,
        bidderToDecline: Aemail,
      });
      if (deleteBidderBidNow?.status === 200) {
        setDoneDeleteBid(true);
      }
      toaster.success(DECLINE_SUCCESSFULLY);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile_page">
      <Container fluid>
        <Row>
          <Col md={12} lg={6} xl={6}>
            <DashboardListing
              page="dashboard"
              patronData={fetchPatron}
              closeModal={closeMdoal}
            />
          </Col>
          <Col md={12} lg={6} xl={6}>
            {biddingRequest?.length === 0 ? (
              <div className="no_posts_message">
                <h1>No Bids Request Available.</h1>
              </div>
            ) : (
              biddingRequest?.map((bidder: any, index: any) => (
                <div className="dashboard_card" key={index}>
                  <div className="dashboard_card_inner">
                    <div className="dashboard_card_inner_header">
                      <span className="token_icon">
                        <img
                          src={
                            isImageFile(bidder?.profilePicture)
                              ? baseUrl + bidder?.profilePicture
                              : defaultUserIcon
                          }
                          alt="user_img"
                        />
                      </span>
                      <div className="user_id">
                        <h4>{`${bidder?.firstName} ${bidder?.lastName}`}</h4>
                        <p>{bidder?.emailAddress}</p>
                      </div>
                    </div>
                    <div className="dashboard_card_inner_body">
                      <h6>Posted On:{bidder?.postedAt}</h6>
                      <ButtonCustom
                        title="View Profile"
                        onClick={() => modalDataFunction(bidder)}
                      />
                    </div>
                  </div>
                  <h6>Propost Details</h6>
                  <div className="dashboardList_data_value">
                    <ul>
                      <li>
                        <h4>Amount</h4>
                        <p>{bidder?.estimatedAmount} USD</p>
                      </li>
                      <li>
                        <h4>Expected Timeline</h4>
                        <p>{bidder?.estimatedDelivery}</p>
                      </li>
                      <li>
                        <h4>GitHub URL</h4>
                        {bidder?.gitHub ? (
                          <a
                            href={bidder?.gitHub}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={bidder?.gitHub}
                          >
                            {bidder?.gitHub?.slice(0, 15) +
                              "..." +
                              bidder?.gitHub?.slice(
                                bidder?.gitHub?.length - 15
                              )}
                          </a>
                        ) : (
                          <p>No GitHub URL available.</p>
                        )}
                      </li>
                    </ul>
                  </div>
                  <div className="viewCard_btn">
                    {bidder?.status === "CONFIRM" || bidAccepted ? (
                      <ButtonCustom
                        title="Accepted"
                        type="submit"
                        className="red_border bordered"
                        disabled={true}
                      />
                    ) : (
                      <>
                        <ButtonCustom
                          title="Decline bidder"
                          type="submit"
                          className="red_border bordered"
                          onClick={() =>
                            deleteBid(
                              userEmail,
                              bidder?.postID,
                              bidder?.emailAddress
                            )
                          }
                        />
                        <ButtonCustom
                          title="Accept Bidder"
                          type="submit"
                          className="green_bg"
                          onClick={() =>
                            handleAcceptBid(
                              bidder?.postID,
                              bidder?.walletAddress,
                              bidder?.estimatedAmount,
                              bidder?.estimatedDelivery,
                              bidder?.emailAddress
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                  <TransactionModal
                    handleClose={handleCloseNew}
                    successClose={handleCloseNew}
                    crossIcon={crossIcon}
                    show={showNew}
                    modalData={modalData}
                    handleFunction={(e: any) =>
                      handleAcceptBid(
                        bidder?.postID,
                        bidder?.walletAddress,
                        bidder?.estimatedAmount,
                        bidder?.estimatedDelivery,
                        bidder?.emailAddress
                      )
                    }
                  />
                  <div></div>
                </div>
              ))
            )}
            <ProfileBioModal
              confirmBidData={confirmBidData}
              show={show}
              onHide={onHide}
              profileData
            />
            {false ? (
              <div className="no_posts_message">
                <h1>No Bids Request Available.</h1>
              </div>
            ) : isPatron?.extensionRequest && showModal ? (
              biddingRequest?.map((bidder: any, index: any) => (
                <div className="dashboard_card" key={index}>
                  <div className="dashboard_card_inner">
                    <div className="dashboard_card_inner_header">
                      <span className="token_icon">
                        <img
                          src={
                            isImageFile(bidder?.profilePicture)
                              ? baseUrl + bidder?.profilePicture
                              : defaultUserIcon
                          }
                          alt="user_img"
                        />
                      </span>
                      <div className="user_id">
                        <h4>{`${bidder?.firstName} ${bidder?.lastName}`}</h4>
                        <p>{bidder?.emailAddress}</p>
                      </div>
                    </div>
                  </div>
                  <h6>Propost Details</h6>
                  <div className="dashboardList_data_value">
                    <ul>
                      <li>
                        <h4>Proposed Amount</h4>
                        <p>
                          {
                            isPatron?.history[isPatron?.history.length - 1]
                              ?.proposedAmount
                          }{" "}
                          USD
                        </p>
                      </li>
                      <li>
                        <h4>Extend Timeline Request</h4>
                        <p>
                          {moment(
                            Number(
                              isPatron?.history[isPatron?.history.length - 1]
                                ?.proposedDeliveryTime
                            )
                          ).format("DD/MM/YYYY")}
                        </p>
                      </li>
                      <li>
                        <h4>Reason</h4>
                        <p>
                          {
                            isPatron?.history[isPatron?.history.length - 1]
                              ?.reason
                          }
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="viewCard_btn">
                    <ButtonCustom
                      title="Decline"
                      type="submit"
                      className="red_border bordered"
                      show={showNew}
                      onClick={(e: any) => extendTimeLineForPatron()}
                    />
                    <ButtonCustom
                      title="Approval"
                      type="submit"
                      className="green_bg"
                      show={showNew}
                      onClick={(e: any) => extendedTimeLineForPatron(e)}
                    />
                  </div>
                </div>
              ))
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyProfilePage;
