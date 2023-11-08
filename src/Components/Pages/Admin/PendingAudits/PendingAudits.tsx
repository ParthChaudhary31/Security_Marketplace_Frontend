import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./PendingAudits.scss";
import { useLocation } from "react-router-dom";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import DashboardListing from "../Dashboard/DashboardListing/DashboardListing";
import { useSelector } from "react-redux";
import defaultUserIcon from "../../../../Assets/Images/defaultUserIcon.png";
import {
  getAuditBidding,
  transactionRegister,
  updateAuditStatus,
  updateBidStatus,
  updateSalt,
} from "../../../../Api/Actions/user.action";
import moment from "moment";
import { acceptAuditReportTxn } from "../../../../Services/contract.service";
import toaster from "../../../Common/Toast/index";
import { WALLET_CONNECTION_REQUIRE } from "../../../../Constants/AlertMessages/ErrorMessages";

import {
  COMPLETED,
  ERROR_TXN,
  PENDING_TXN,
  SUCCESS,
  SUCCESS_TXN,
  TRANSACTION_PROCESS,
  TRANSACTION_SUCCESS,
  baseUrlReport,
} from "../../../../Constant";
import {
  makeId,
} from "../../../../Services/Helpers/mathhelper";
import {
  baseUrl,
  isImageFile,
} from "../../../../Constant";
import store from "../../../../Redux/store";

import SubmittedPostModal from "../../../Common/CommonModal/SubmittedPostModal/SubmittedPostModal";
import TransactionModal from "../../../Common/SubmitRequestModal/transaction-modal/transaction-modal/TransactionModal";
import { setErrorMessage } from "../../../../Redux/authenticationData/authenticationData";
import { ACCEPT_AUDIT_REPORT_BY_PATRON } from "../../../../Constants/TransactionTypes/TransactionTypes";

const PendingAudits = ({ page }: { page?: string }) => {
  const [userPosts, setUserPosts] = useState<any>({});
  const location = useLocation();
  const { postID } = location.state;
  const profilePictureUrl = baseUrl + userPosts;
  const [biddingRequest, setBiddingRequest] = useState<any>([]);

  const [modalData, setModalData] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });
  const [crossIcon, setCrossIcon] = useState<any>(false);
  const [statusNew, setStatusNew] = useState<any>("");
  const [newTxn, setNewTxn] = useState<any>("");
  const [showNew, setShowNew] = useState(false);
  const handleCloseNew = () => {
    setShowNew(false);
    setStatusNew(newTxn);
  };
  const handleShowNew = () => setShowNew(true);
  const SuccessCloseNew = () => handleCloseNew();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const userEmail = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const reduxWalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  const isWalletConnected: any = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );
  const convertEpochToDate = (epochTimestamp: number) => {
    return moment.unix(Number(epochTimestamp / 1000)).format("DD/MM/YYYY");
  };

  // call loader handleAuditRequest
  const handleAcceptAuditReport = async (
    postId: any,
    userEmail: any,
    auditorEmail: any
  ) => {
    if (isWalletConnected) {
      try {
        handleShowNew();
        setModalData({
          heading: "Audit Report Accepting",
          bodyText: TRANSACTION_PROCESS,
          status: PENDING_TXN,
          txHash: null,
        });
        const response: any = await AcceptAuditReport(
          postId,
          userEmail,
          auditorEmail
        );
        if (response?.status === 200) {
          setModalData({
            heading: TRANSACTION_SUCCESS,
            bodyText: "Audit Report Accepted Successfully",
            status: SUCCESS_TXN,
            txHash: response?.txHash,
          });
          setNewTxn(response?.txHash);
          setCrossIcon(true);
        } else {
          const errorMessage:any = store?.getState()?.authenticationDataSlice?.errorMessage;
          setModalData({
            heading: "Audit Report Accepting ",
            bodyText: errorMessage?errorMessage:"Audit Report Accepting Failed",
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
  // number of bidder on a post
  const bidderUser = async () => {
    try {
      const biddingResult = await getAuditBidding({
        emailAddress: userEmail,
        postID: postID,
      });
      if (biddingResult?.status === 200) {
        const updatedResult = await biddingResult?.data?.map((item: any) => {
          item.postedAt = moment(item.postedAt).format("DD/MM/YYYY");
          const EpochToNormal = convertEpochToDate(
            biddingResult?.data[0].estimatedDelivery
          );
          item.estimatedDelivery = EpochToNormal;
          return item;
        });
        setBiddingRequest(updatedResult);
        setUserPosts(updatedResult[0]?.profilePicture);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // useEffect(() => {
  //   bidderUser();
  // }, []);

  useEffect(() => {
    bidderUser();
  }, [statusNew]);

  //Accept audit report API
  const AcceptAuditReport = async (
    postId: any,
    userEmail: any,
    auditorEmail: any
  ) => {
    if (isWalletConnected) {
      try {
        let salt = await makeId(10);
        const submitAuditSalt = await updateSalt({
          emailAddress: userEmail,
          postID: postId,
          salt: salt,
        });
        if (submitAuditSalt?.status === 200) {
          const auditReportTxn: any = await acceptAuditReportTxn({
            userAddress: reduxWalletAddress,
            auditId: submitAuditSalt?.data?.currentAuditId,
            bool: true,
          });
          if (auditReportTxn?.isFinalized === true) {
            const auditStatus: any = await updateAuditStatus({
              emailAddress: userEmail,
              postID: postId,
              status: COMPLETED,
              txHash: auditReportTxn?.txHash,
              salt: salt,
            });
            if (auditStatus?.status === 200) {
              const BidStatus: any = await updateBidStatus({
                emailAddress: userEmail,
                auditorEmail: auditorEmail,
                postID: postId,
                status: SUCCESS,
              });
              transactionRegisterForAcceptAudit();
              return {
                message: BidStatus?.message,
                status: BidStatus?.status,
                txHash: auditReportTxn?.txHash,
              };
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      toaster.error(WALLET_CONNECTION_REQUIRE);
    }
  };
  const transactionRegisterForAcceptAudit = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForAcceptAuditReport =
        store.getState().userDataSlice?.transactionHashForSubmitReportByPatron;
      const result: any = await transactionRegister(
        userEmail,
        txnHashForAcceptAuditReport?.toString(),
        time,
        ACCEPT_AUDIT_REPORT_BY_PATRON
      );
      if (result?.status === 200) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="profile_page">
      <Container fluid>
        <Row>
          <Col md={12} lg={6} xl={6}>
            <DashboardListing page="dashboard" />
          </Col>
          <Col md={12} lg={6} xl={6}>
            {biddingRequest?.length === 0 ? (
              <div className="no_posts_message">
                <h1>No Bids Request Available.</h1>
              </div>
            ) : (
              biddingRequest?.map((bidder: any, index: any) =>
                bidder?.status === "CONFIRM" ? (
                  <div className="dashboard_card" key={index}>
                    <div className="dashboard_card_inner">
                      <div className="dashboard_card_inner_header">
                        <span className="token_icon">
                          {/* <img src={icon} alt="" /> */}
                          <img
                            src={
                              isImageFile(profilePictureUrl)
                                ? profilePictureUrl
                                : defaultUserIcon
                            }
                            alt="list-img"
                          />
                        </span>
                        <div className="user_id">
                          <h4>{`${bidder?.firstName} ${bidder?.lastName}`}</h4>
                          <p>{bidder?.emailAddress}</p>
                        </div>
                      </div>
                      <div className="dashboard_card_inner_body">
                        <h6>Posted On:{bidder?.postedAt}</h6>
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
                                  bidder?.gitHub.length - 15
                                )}
                            </a>
                          ) : (
                            <p>No GitHub URL Available.</p>
                          )}
                        </li>
                        <li className="d-block text-start w-100 ">
                          <h4 className="me-auto">Audit Report</h4>
                          {bidder?.submit.map((reportUrl, index) => (
                            <div key={index} className="report mx-1">
                              <a
                                href={baseUrlReport + reportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Report-{index + 1}
                              </a>
                            </div>
                          ))}
                        </li>
                      </ul>
                    </div>
                    <div className="viewCard_btn">
                      <ButtonCustom
                        title="Decline Audit"
                        type="submit"
                        className="bordered"
                        onClick={handleShow}
                      />
                      <SubmittedPostModal
                        show={show}
                        onHide={handleClose}
                        postID={bidder?.postID}
                        userEmail={bidder?.posterEmailAddress}
                        walletAddress={bidder?.walletAddress}
                        auditId={bidder?.currentAuditID}
                      />
                      <ButtonCustom
                        title="Accept Audit"
                        type="submit"
                        className="green_bg"
                        onClick={() =>
                          handleAcceptAuditReport(
                            bidder?.postID,
                            bidder?.posterEmailAddress,
                            bidder?.emailAddress
                          )
                        }
                      />
                    </div>
                    <div>
                      <TransactionModal
                        handleClose={handleCloseNew}
                        successClose={SuccessCloseNew}
                        crossIcon={crossIcon}
                        show={showNew}
                        modalData={modalData}
                        handleFunction={() =>
                          handleAcceptAuditReport(
                            bidder?.postID,
                            bidder?.posterEmailAddress,
                            bidder?.emailAddress
                          )
                        }
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )
              )
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PendingAudits;
