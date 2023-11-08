import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import "./DashboardListing.scss";
import defaultUserIcon from "../../../../../Assets/Images/defaultUserIcon.png";
import social_img2 from "../../../../../Assets/Images/Icons/linkndin.svg";
import social_img3 from "../../../../../Assets/Images/Icons/telegram.svg";
import InputCustom from "../../../../Common/Inputs/InputCustom";
import ButtonCustom from "../../../../Common/Button/ButtonCustom";
import TextArea from "../../../../Common/FormInputs/TextArea";
import green_tick from "../../../../../Assets/Images/Icons/green-tick.svg";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  getAllAuditFullDetailsForPublic,
  postAuditBidding,
  transactionRegister,
  updateUserClaim,
} from "../../../../../Api/Actions/user.action";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BackButton from "../../../../Common/BackButton/BackButton";
import {
  ERROR_TXN,
  FAILED,
  IN_PROGRESS,
  PENDING,
  PENDING_TXN,
  PLATFORM_FEE_PERCENTAGE,
  SUCCESS_TXN,
  TRANSACTION_PROCESS,
  TRANSACTION_SUCCESS,
  baseUrl,
  isImageFile,
} from "../../../../../Constant";
import store from "../../../../../Redux/store";
import DatePickerCustom from "../../../../Common/DatePickerCustom/DatePickerCustom";
import { InfoIcon } from "../../../../../Assets/Images/Icons/SvgIcons";
import {
  claimAmountTxn,
  getPaymentInfo,
} from "../../../../../Services/contract.service";
import TransactionModal from "../../../../Common/SubmitRequestModal/transaction-modal/transaction-modal/TransactionModal";
import { WALLET_CONNECTION_REQUIRE } from "../../../../../Constants/AlertMessages/ErrorMessages";
import {
  remove18DecimalComma,
  removeComma,
} from "../../../../../Services/Helpers/mathhelper";
import toaster from "../../../../Common/Toast";
import ProfileBioModal from "../../../../Common/CommonModal/ProfileBioModal/ProfileBioModal";
import {
  setErrorMessage,
  setPatronAccepted,
} from "../../../../../Redux/authenticationData/authenticationData";
import { CLAIM_AMOUNT_BY_PATRON } from "../../../../../Constants/TransactionTypes/TransactionTypes";

const DashboardListing = ({
  className,
  page,
  patronData,
  closeModal,
}: {
  className?: string;
  page?: string;
  patronData?: any;
  closeModal?: boolean;
}) => {
  const moment = require("moment");
  const navigate = useNavigate();
  const location = useLocation();
  const { postID } = location.state;
  const [userPosts, setUserPosts] = useState<any>({});
  const [resetState, setResetState] = useState<any>(false);
  const [link, Setlink] = useState<any>([]);
  const [sameUser, setSameUser] = useState<boolean>(false);
  const [deadlineExpired, setDeadlineExpired] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<any>({});
  const [profileData, setProfileData] = useState(null);
  const [postCurrentAuditId, setPostCurrentAuditId] = useState<Number>();
  const [auditExpired, setAuditExpired] = useState<boolean>(true);
  const [resultClaim, setResultClaim] = useState<any>("");

  const [modalData, setModalData] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });
  const [crossIcon, setCrossIcon] = useState<any>(false);
  const [showNew, setShowNew] = useState(false);

  const handleCloseNew = () => setShowNew(false);
  const handleShowNew = () => setShowNew(true);
  const SuccessCloseNew = () => handleCloseNew();

  const userEmail = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const isWalletConnected: any =
    store?.getState().authenticationDataSlice?.isWalletConnected;

  const reduxWalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  const patronAcceptedBidder = useSelector(
    (state: any) => state?.authenticationDataSlice?.patronAccepted
  );

  const profilePictureUrl = baseUrl + userPosts?.profilePicture;
  const convertedDateTime = moment(userPosts?.createdAt).format("DD/MM/YYYY");
  const [check, setCheck] = useState<any>({ state: false, value: "" });

  const [show, setShow] = useState(false);
  const onHide = () => setShow(false);
  const modalShow = () => setShow(true);
  let socialdata = [
    {
      social_img: social_img2,
      link: "Linked In",
      className: "blue2",
      name: "linkedin",
    },
    {
      social_img: social_img3,
      link: "Telegram",
      className: "blue3",
      name: "t.me",
    },
  ];

  //Formik validation
  const confirmBid = Yup.object().shape({
    amount: Yup.number()
      .typeError("Offer Amount must be a number")
      .required("*This Field is required")
      .min(0, "Offer Amount cannot be negative"),
  });
  const formik = useFormik({
    initialValues: {
      time: "",
      amount: "",
    },
    validationSchema: confirmBid,
    onSubmit: async (values) => {},
  });

  const callClaimAmountTxn = async (
    userAddress: any,
    currentAuditId: any,
    emailAddress: any,
    postID: any
  ) => {
    try {
      const response: any = await claimAmountTxn({
        userAddress: userAddress,
        currentAuditId: currentAuditId,
      });
      if (response?.isFinalized === true) {
        const userClaim = await updateUserClaim({
          emailAddress: emailAddress,
          postID: postID,
        });
        if (userClaim?.status === 200) {
          await transactionRegisterForClaimAmount();
          return {
            message: userClaim?.message,
            status: userClaim?.status,
            txHash: response?.txHash,
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClaimAmountTxn = async (
    userAddress: any,
    currentAuditId: any,
    emailAddress: any,
    postID: any
  ) => {
    if (isWalletConnected) {
      try {
        handleShowNew();
        setModalData({
          heading: "Claiming Audit Amount",
          bodyText: TRANSACTION_PROCESS,
          status: PENDING_TXN,
          txHash: null,
        });
        const response: any = await callClaimAmountTxn(
          userAddress,
          currentAuditId,
          emailAddress,
          postID
        );
        if (response?.status === 200) {
          setModalData({
            heading: "Audit Claim Successfull",
            bodyText: TRANSACTION_SUCCESS,
            status: SUCCESS_TXN,
            txHash: response?.txHash,
          });
          setCrossIcon(true);
        } else {
          const errorMessage: any =
            store?.getState()?.authenticationDataSlice?.errorMessage;
          setModalData({
            heading: "Audit Claim",
            bodyText: errorMessage ? errorMessage : "Audit Claim failed",
            status: ERROR_TXN,
            txHash: null,
          });
        }
        store?.dispatch(setErrorMessage(""));
        return response?.txHash;
      } catch (error) {
        console.error(error);
      }
    } else {
      toaster.error(WALLET_CONNECTION_REQUIRE);
    }
  };
  // Fn to get the audit post on postID
  const auditDetailsPostForPublic = async () => {
    try {
      const result: any = await getAllAuditFullDetailsForPublic(
        userEmail,
        postID
      );
      if (result?.status === 200) {
        setUserPosts(result?.data);
        if (result?.data?.emailAddress === userEmail) {
          setSameUser(true);
          setPostCurrentAuditId(result?.data?.currentAuditId);
        }
        const sociaLink: any = socialdata?.find((value: any) => {
          return result?.data?.socialLink?.includes(value?.name);
        });
        Setlink(sociaLink);
        if (patronData !== undefined) {
          patronData(result?.data);
        }
        setProfileData(result?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    auditDetailsPostForPublic();
    setTimeout(() => {
      if (postCurrentAuditId) {
        callGetPaymentInfo();
      }
    }, 100);
    store?.dispatch(setPatronAccepted(false));
  }, [postCurrentAuditId, resultClaim, closeModal]);

  const convertEpochToDate = (epochTimestamp: number) => {
    return moment.unix(Number(epochTimestamp / 1000)).format("DD/MM/YYYY");
  };

  //Fn Auditer bidding for post
  const auditerConfirm = async () => {
    const result: any = await getAllAuditFullDetailsForPublic(
      userEmail,
      postID
    );
    const posterEmailAddress = result?.data?.emailAddress;
    const estimatedAmount = formik.values.amount;
    const TimelineRequired = formik.values.time;
    setCheck("");

    try {
      const apiBidding = await postAuditBidding({
        emailAddress: userEmail,
        posterEmailAddress: posterEmailAddress,
        estimatedAmount: estimatedAmount,
        estimatedDelivery: TimelineRequired,
        postID: postID,
      });
      if (apiBidding?.status === 200) {
        setResetState(true);
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkRedirect = (link: any) => {
    if (!link) {
      return;
    }

    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      link = "https://" + link;
    }

    window.open(link, "_blank");
  };

  const formatSocialLink = (link: any) => {
    if (!link) {
      return "";
    }
    const modifiedLink = link.replace(/^https:\/\//, "");
    return modifiedLink;
  };

  //claim amount
  const handleClaimAmount = async () => {
    const resultClaim: any = await handleClaimAmountTxn(
      reduxWalletAddress,
      userPosts?.currentAuditId,
      userPosts?.emailAddress,
      userPosts?.postID
    );
    setResultClaim(resultClaim);
  };

  const resultTimeCalcuation = async (data: any) => {
    const starttime = removeComma(data?.Ok?.starttime);
    const deadline = removeComma(data?.Ok?.deadline);
    const assignTime = starttime + deadline;
    const currentDate = new Date();
    const currentEpochTime = currentDate.getTime();
    if (assignTime >= currentEpochTime) {
      setDeadlineExpired(false);
    } else {
      setDeadlineExpired(true);
    }
  };

  const auditExpiredStatus = async (data: any) => {
    if (data?.Ok?.currentstatus === "AuditExpired") {
      setAuditExpired(true);
    } else {
      setAuditExpired(false);
    }
  };
  const callGetPaymentInfo = async () => {
    const resultPayment: any = await getPaymentInfo(
      reduxWalletAddress,
      postCurrentAuditId
    );
    if (resultPayment !== undefined) {
      await setPaymentInfo(resultPayment?.toHuman());
      await resultTimeCalcuation(resultPayment?.toHuman());
      await auditExpiredStatus(resultPayment?.toHuman());
    }
  };

  const navigateToProfile = () => {
    navigate("/admin/dasboard");
  };
  const transactionRegisterForClaimAmount = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForClaimAmount =
        store.getState().userDataSlice?.transactionHashForClaimAmount;
      const result: any = await transactionRegister(
        userEmail,
        txnHashForClaimAmount?.toString(),
        time,
        CLAIM_AMOUNT_BY_PATRON
      );
      if (result?.status === 200) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className={`dashboardList ${className}`}>
        <BackButton page={page === "dashboard" ? "profile" : "listing"} />

        <div className="dashboardList_data">
          <div className="dashboardList_data_header">
            <div className="dashboardList_data_header_info">
              <div className="list_image">
                <img
                  src={
                    isImageFile(profilePictureUrl)
                      ? profilePictureUrl
                      : defaultUserIcon
                  }
                  alt="list-img"
                />
              </div>
              <div className="list_content">
                <p>UID: {userPosts?.postID}</p>
                <h6>
                  {userPosts?.firstName} {userPosts?.lastName}
                </h6>
                <p className="user_email">{userPosts?.emailAddress}</p>
              </div>
            </div>
            <div className="dashboardList_data_header_post">
              <p>Posted On:{convertedDateTime}</p>
              <ButtonCustom title="View Profile" onClick={modalShow} />
            </div>
          </div>

          <ProfileBioModal
            show={show}
            onHide={onHide}
            profileData={profileData}
          />

          <div className="dashboardList_data_audit">
            <p className="audit_heading">Audit Types:</p>
            <div className="dashboardList_data_audit_data">
              {userPosts?.auditType?.map((item: any, key: any) => {
                return (
                  <div key={key} className="dashboard_audit">
                    <div className="audit_btn">
                      <p>{item}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="dashboardList_data_value">
            <ul>
              <li>
                <h4>GitHub URL</h4>
                <p>
                  <a
                    href={userPosts?.gitHub}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {userPosts?.gitHub}
                  </a>
                </p>
              </li>
              <li>
                <h4>
                  Offered Amount
                  <OverlayTrigger
                    placement={"right"}
                    overlay={
                      <Tooltip id="button-tooltip">
                        Platform Fees {PLATFORM_FEE_PERCENTAGE}%
                      </Tooltip>
                    }
                  >
                    <span className="ms-3">
                      <InfoIcon />
                    </span>
                  </OverlayTrigger>
                </h4>
                <p>{userPosts?.offerAmount} USD</p>
              </li>
              <li>
                <h4>Expected Timeline</h4>
                <p>{convertEpochToDate(userPosts?.estimatedDelivery)}</p>
              </li>
              <li>
                <h4>Payment Status</h4>
                <p>
                  <img
                    src={green_tick}
                    alt="green-tick"
                    className="green_tick"
                  />
                  Done
                </p>
              </li>
            </ul>
          </div>

          <div className="dashboardList_data_description">
            <Form>
              <Form.Group className="textarea_input" controlId="formBasicEmail">
                <Row>
                  <Col xl={12}>
                    <TextArea
                      label="Description"
                      value={userPosts?.description}
                      placeholder="Describe about your Project"
                      readOnly={true}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </div>
          {userEmail === userPosts?.emailAddress ? (
            <div className="d-flex justify-content-between align-items-center">
              <div className="dashboardList_data_claim_sec">
                {patronAcceptedBidder === true ? (
                  <ButtonCustom
                    disabled={true}
                    title="Claim"
                    className="claim_btn"
                  />
                ) : userPosts?.status === PENDING && auditExpired === false ? (
                  <ButtonCustom
                    onClick={handleClaimAmount}
                    title="Claim"
                    className="claim_btn"
                  />
                ) : userPosts?.status === PENDING && auditExpired === true ? (
                  <ButtonCustom
                    disabled={true}
                    title= ""
                    className="claim_btn"
                  />
                ) : userPosts?.status === FAILED && auditExpired === true ?  (
                  <ButtonCustom
                    disabled={true}
                    title= "claimed"
                    className="claim_btn"
                  />
                ): userPosts?.status === IN_PROGRESS &&
                  deadlineExpired === true &&
                  auditExpired === false ? (
                  <ButtonCustom
                    onClick={handleClaimAmount}
                    title="Claim"
                    className="claim_btn"
                  />
                ) : userPosts?.status === IN_PROGRESS &&
                  deadlineExpired === true &&
                  auditExpired === true ? (
                  <ButtonCustom
                    disabled={true}
                    title="Claimed"
                    className="claim_btn"
                  />
                ) : (
                  <ButtonCustom
                    disabled={true}
                    title="Claim"
                    className="claim_btn"
                  />
                )}
              </div>
              <div className="dashboardList_data_claim_amount">
                Claim Amount :{" "}
                {paymentInfo?.Ok?.value && auditExpired === false
                  ? remove18DecimalComma(paymentInfo?.Ok?.value)
                  : "0"}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="dashboardList_data_audit">
            <p className="audit_heading">Social Accounts</p>
            <div className="dashboardList_data_audit_social">
              <div className="social_account" key={link?.name}>
                <div className="social_img">
                  <a
                    href={formatSocialLink(userPosts?.socialLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkRedirect(
                        formatSocialLink(userPosts?.socialLink)
                      );
                    }}
                  >
                    <img src={link?.social_img} alt="social-img" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {sameUser ? (
            ""
          ) : userPosts?.status === PENDING ? (
            <div className="dashboardList_data_input">
              <Form>
                <Form.Group className="list_input">
                  <Row>
                    <Col xl={6}>
                      <DatePickerCustom
                        type="time"
                        id="time"
                        label="Timeline Required"
                        className="mb-0 max-field"
                        placeholder="Enter Estimated Delivery"
                        Dateclass="post_inputNew"
                        onClick={formik.handleBlur}
                        dateType="time"
                        onChange={formik.handleChange}
                        dateFormat="dd/MM/yyyy"
                        onBlur={formik.handleBlur}
                        value={formik.values.time}
                        checkSetter={setCheck}
                        check={check}
                        data={formik.values}
                        isInvalid={formik.touched.time && !!formik.errors.time}
                        error={
                          formik.errors.time && formik.touched.time ? (
                            <span className="error-message">
                              {formik.errors.time}
                            </span>
                          ) : null
                        }
                        resetState={resetState}
                        setResetState={setResetState}
                      ></DatePickerCustom>
                    </Col>
                    <Col xl={6}>
                      <InputCustom
                        type="number"
                        label="Offered Amount"
                        className="mt-4 mt-lg-0 mb-0 max-field"
                        placeholder="Enter Amount"
                        id="amount"
                        disableDecimal="."
                        onBlur={formik.handleBlur}
                        maxLength={8}
                        onChange={(e: any) => {
                          e.preventDefault();
                          const { value } = e.target;
                          const regex = /^(\d+)?$/;
                          if (regex.test(value.toString())) {
                            formik.handleChange(e);
                          }
                        }}
                        value={formik.values.amount}
                        isInvalid={
                          formik.touched.amount && !!formik.errors.amount
                        }
                        error={
                          formik.errors.amount && formik.touched.amount ? (
                            <span className="error-message">
                              {formik.errors.amount}
                            </span>
                          ) : null
                        }
                        rightIcon={
                          <>
                            <p style={{ color: "#FB8B34 " }}>USD</p>
                          </>
                        }
                      ></InputCustom>
                    </Col>
                    <div className="input_btns">
                      <ButtonCustom
                        title="Confirm bid"
                        type="button"
                        disabled={!formik.values.time || !formik.values.amount}
                        onClick={auditerConfirm}
                      />
                      <ButtonCustom
                        title="Cancel"
                        type="submit"
                        className="bordered"
                        onClick={navigateToProfile}
                      />
                    </div>
                  </Row>
                </Form.Group>
              </Form>
            </div>
          ) : (
            <div className="bid_text"> This bid is no longer available</div>
          )}
        </div>
        <div>
          <TransactionModal
            handleClose={handleCloseNew}
            successClose={SuccessCloseNew}
            crossIcon={crossIcon}
            show={showNew}
            modalData={modalData}
            handleFunction={() => handleClaimAmount()}
          />
        </div>
      </section>
    </>
  );
};
export default DashboardListing;
