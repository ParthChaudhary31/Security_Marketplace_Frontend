import { useState } from "react";
import CommonModal from "../CommonModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./ExtendRequestModal.scss";
import InputCustom from "../../Inputs/InputCustom";
import TextArea from "../../FormInputs/TextArea";
import ButtonCustom from "../../Button/ButtonCustom";
import { useSelector } from "react-redux";
import { setExtendTimelineTxn } from "../../../../Services/contract.service";
import { WALLET_CONNECTION_REQUIRE } from "../../../../Constants/AlertMessages/ErrorMessages";
import toaster from "../../Toast";
import moment from "moment";
import store from "../../../../Redux/store";

import TransactionModal from "../../SubmitRequestModal/transaction-modal/transaction-modal/TransactionModal";
import {
  ERROR_TXN,
  PENDING_TXN,
  SUCCESS_TXN,
  TRANSACTION_PROCESS,
  TRANSACTION_SUCCESS,
} from "../../../../Constant";
import { EXTENDED_TIMELINE_BY_AUDITOR } from "../../../../Constants/TransactionTypes/TransactionTypes";
import {
  setExtendTimeLinePost,
  transactionRegister,
} from "../../../../Api/Actions/user.action";
import { setErrorMessage } from "../../../../Redux/authenticationData/authenticationData";
import { setStatusExtendedForAuditor } from "../../../../Redux/userData/userData";

const ExtendRequestModal = ({ show, onHide, extendedTime, userPosts }) => {
  const [showNew, setShowNew] = useState(false);
  const [crossIcon, setCrossIcon] = useState<any>(false);
  const handleCloseNew = () => {
    onHide();
    setShowNew(false);
    formik.resetForm();
  };

  const handleShowNew = () => setShowNew(true);
  const [modalDataLoader, setModalDataLoader] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });

  const extendedTimelineSchema = Yup.object().shape({
    proposedDeliveryTime: Yup.number()
      .required("*This Field Is Required")
      .min(1, "Days Must Be Greater Than Zero")
      .max(365, "Days Must Be Smaller Than 365 Days")
      .positive("Days Must Be Greater Than Zero"),
    proposedAmount: Yup.number()
      .required("*This Field Is Required")
      .min(1, "Price Deduction Percentage Must Be Greater Than Zero")
      .positive("Price Must Be Greater Than Zero"),
    reason: Yup.string()
      .required("*This Field Is Required")
      .max(2000, "Maximum 2000 Characters Allowed.")
      .test(
        "no-blank-spaces",
        "Blank spaces are not allowed in the reason field.",
        (value) => {
          // Remove leading and trailing spaces
          const trimmedValue = value.trim();
          // Check if the trimmed value is not empty
          return trimmedValue !== "";
        }
      ),
  });

  const isWalletConnected: any = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );
  const reduxWalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  const userEmail = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );

  const formik = useFormik({
    initialValues: {
      emailAddress: "",
      postID: "",
      proposedDeliveryTime: "",
      proposedAmount: "",
      reason: "",
      isAccepted: "",
    },
    validationSchema: extendedTimelineSchema,
    onSubmit: async (values) => {},
  });

  const statusForExtended: any = useSelector(
    (state: any) => state?.userDataSlice?.statusExtendedForAuditor
  );

  //MODAL FOR EXTENDED TIMELINE BY AUDITOR
  const extendedTimeLineForAuditor = async (e: any) => {
    if (isWalletConnected) {
      try {
        handleShowNew();
        setModalDataLoader({
          heading: "Extension Request",
          bodyText: TRANSACTION_PROCESS,
          status: PENDING_TXN,
          txHash: null,
        });
        const callExtendTimeline: any =
          await handleExtendedTimeLineForAuditor();
        if (callExtendTimeline?.status === 200) {
          await transactionRegisterForExtendedByAuditor();
          setModalDataLoader({
            heading: TRANSACTION_SUCCESS,
            bodyText: callExtendTimeline?.message,
            status: SUCCESS_TXN,
            txHash: callExtendTimeline?.txHash,
          });
          store.dispatch(setStatusExtendedForAuditor(!statusForExtended));
          setCrossIcon(true);
        } else {
          const errorMessage: any =
            store?.getState()?.authenticationDataSlice?.errorMessage;
          setModalDataLoader({
            heading: "Extension Request ",
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

  //API REQUEST FOR EXTENDED TIMELINE
  const handleExtendedTimeLineForAuditor = async () => {
    const postID = extendedTime?.postID;
    const auditorEmail = extendedTime?.auditorEmail;
    const parsedDate: any =
      (moment(userPosts?.estimatedDelivery, "DD/MM/YYYY").unix() +
        Number(formik.values.proposedDeliveryTime) * 86400) *
      1000;
      const priceChange:any = userPosts?.offerAmount - (userPosts.offerAmount*(Number(formik.values.proposedAmount)/100))
    try {
      const result: any = await setExtendTimelineTxn({
        proposedDeliveryTime: parsedDate,
        proposedAmount: formik.values.proposedAmount,
        userAddress: reduxWalletAddress,
        currentAuditId: userPosts?.currentAuditId,
      });

      if (result?.isFinalized === true) {
        const modalData: any = await setExtendTimeLinePost({
          emailAddress: auditorEmail,
          postID: postID,
          proposedDeliveryTime: parsedDate,
          proposedAmount: priceChange,
          reason: formik.values.reason,
          isAccepted: true,
        });
        return {
          status: modalData?.status,
          txHash: result?.txHash,
          message: modalData?.message,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  //TXN REGISTER FOR EXTENDED TIMELINE BY AUDITOR
  const transactionRegisterForExtendedByAuditor = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForExtendByAuditor =
        store.getState().userDataSlice?.transactionHashForExtendedForAuditor;

      const result: any = await transactionRegister(
        userEmail,
        txnHashForExtendByAuditor?.toString(),
        time,
        EXTENDED_TIMELINE_BY_AUDITOR
      );
      if (result?.status === 200) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = () => {
    formik.resetForm();
  };
  
  return (
    <>
      <CommonModal
        heading="Extension Request"
        className="extend_modal"
        show={show}
        crossBtn
        onHide={() => {
          handleDelete();
          onHide();
        }}
      >
        <div className="extend_modal_inner">
          <h2>Current Terms</h2>
          <div className="d-flex gap-3">
            <div className="extend_modal_inner_box">
              <h5>Timeline</h5>
              <p>{userPosts?.estimatedDelivery}</p>
            </div>
            <div className="extend_modal_inner_box">
              <h5>Price</h5>
              <p>{userPosts?.offerAmount} USD</p>
            </div>
          </div>
          <h2>New Request</h2>
          <form onSubmit={formik.handleSubmit}>
            <InputCustom
              label="Timeline"
              placeholder="Days"
              id="proposedDeliveryTime"
              name="proposedDeliveryTime"
              type="number"
              onChange={(e: any) => {
                e.preventDefault();
                const { value } = e.target;
                const regex = /^(\d+)?$/;
                if (regex.test(value.toString())) {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              value={formik.values.proposedDeliveryTime}
              maxLength={3}
              isInvalid={
                formik.touched.proposedDeliveryTime &&
                formik.errors.proposedDeliveryTime
                  ? "is-invalid"
                  : ""
              }
              error={
                formik.errors.proposedDeliveryTime &&
                formik.touched.proposedDeliveryTime ? (
                  <span className="error-message">
                    {formik.errors.proposedDeliveryTime}
                  </span>
                ) : null
              }
            />
            <InputCustom
              label="Price Deduction Percentage"
              placeholder="Enter Price Deduction Percentage"
              id="proposedAmount"
              name="proposedAmount"
              type="number"
              onChange={(e: any) => {
                e.preventDefault();
                const { value } = e.target;
                const regex = /^(\d+)?$/;
                if (regex.test(value.toString())) {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              value={formik.values.proposedAmount}
              maxLength={2}
              isInvalid={
                formik.touched.proposedAmount && formik.errors.proposedAmount
                  ? "is-invalid"
                  : ""
              }
              error={
                formik.errors.proposedAmount &&
                formik.touched.proposedAmount ? (
                  <span className="error-message">
                    {formik.errors.proposedAmount}
                  </span>
                ) : null
              }
            />
            <TextArea
              label="Reason"
              placeholder="Enter Reason"
              onChange={formik.handleChange}
              name="reason"
              value={formik.values.reason}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.reason && formik.errors.reason
                  ? "is-invalid"
                  : ""
              }
              error={
                formik.errors.reason && formik.touched.reason ? (
                  <span className="error-message">{formik.errors.reason}</span>
                ) : null
              }
            />
          </form>
          <div className="btn_sec d-flex gap-3">
            <ButtonCustom
              type="submit"
              title="Ok"
              fluid
              onClick={extendedTimeLineForAuditor}
              disabled={!formik.isValid || !formik.dirty}
            />
            <ButtonCustom
              title="Cancel"
              onClick={() => {
                handleDelete();
                onHide();
              }}
              className="bordered"
            />
          </div>
          <div>
            <TransactionModal
              handleClose={handleCloseNew}
              show={showNew}
              crossIcon={crossIcon}
              successClose={handleCloseNew}
              modalData={modalDataLoader}
              handleFunction={(e: any) => extendedTimeLineForAuditor(e)}
            />
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default ExtendRequestModal;
