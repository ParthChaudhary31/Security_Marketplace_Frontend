import React, { useEffect, useState } from "react";
import "./SubmittedPostModal.scss";
import CommonModal from "../CommonModal";
import TextArea from "../../FormInputs/TextArea";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import ButtonCustom from "../../Button/ButtonCustom";
import { declineAuditReportTxn } from "../../../../Services/contract.service";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import {
  selectArbiters,
  transactionRegister,
} from "../../../../Api/Actions/user.action";
import toaster from "../../Toast";
import { WALLET_CONNECTION_REQUIRE } from "../../../../Constants/AlertMessages/ErrorMessages";
import TransactionModal from "../../SubmitRequestModal/transaction-modal/transaction-modal/TransactionModal";
import { useNavigate } from "react-router-dom";
import store from "../../../../Redux/store";
import { setErrorMessage } from "../../../../Redux/authenticationData/authenticationData";
import {
  ERROR_TXN,
  PENDING_TXN,
  SUCCESS_TXN,
  TRANSACTION_PROCESS,
} from "../../../../Constant";
import { AUDIT_REPORT_DECLINE_BY_PATRON } from "../../../../Constants/TransactionTypes/TransactionTypes";

const SubmittedPostModal = ({
  show,
  onHide,
  postID,
  userEmail,
  walletAddress,
  auditId,
}) => {
  const navigate = useNavigate();

  const [modalData, setModalData] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });
  const [statusNew, setStatusNew] = useState<any>("");
  const [crossIcon, setCrossIcon] = useState<any>(false);
  const [showNew, setShowNew] = useState(false);
  const handleCloseNew = () =>
    statusNew === 200 ? navigateToProfile() : setShowNew(false);
  const handleShowNew = () => setShowNew(true);
  const SuccessCloseNew = () =>
    statusNew === 200 ? navigateToProfile() : handleCloseNew();
  const [resetReason, setResetReason] = useState(false);

  const reduxWalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  const isWalletConnected: any = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );

  const [selectedDissatisfaction, setSelectedDissatisfaction] =
    useState<any>(true);
  const SubmitAuditSchema = Yup.object().shape({
    reason: Yup.string()
      .required("*This Field is required")
      .max(2000, "Maximum 2000 characters allowed.")
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

  const navigateToProfile = () => {
    navigate("/admin/my-profile");
  };

  const formik = useFormik({
    initialValues: {
      emailAddress: "",
      postID: "",
      proposedDeliveryTime: "",
      proposedAmount: "",
      reason: "",
      isAccepted: "",
    },
    validationSchema: SubmitAuditSchema,
    onSubmit: async (values) => {},
  });
  useEffect(() => {
    if (resetReason) {
      formik.setFieldValue("reason", ""); // Reset the reason field
      setResetReason(false); // Reset the reset status
    }
  }, [resetReason]);

  const handleCrossClick = () => {
    setResetReason(true); // Set the reset status to trigger the reset
    onHide(); // Close the modal
  };

  // call loader handleAuditRequest
  const handleDeclineAudit = async (e: any) => {
    if (isWalletConnected) {
      try {
        handleShowNew();
        setModalData({
          heading: "Decline Audit Report",
          bodyText: TRANSACTION_PROCESS,
          status: PENDING_TXN,
          txHash: null,
        });
        const response: any = await declineAudit(e);
        if (response?.status === 200) {
          setModalData({
            heading: ` Audit Report Declined Successfully `,
            bodyText: response?.message,
            status: SUCCESS_TXN,
            txHash: response?.txHash,
          });
          setStatusNew(response?.status);
          setCrossIcon(true);
        } else {
          const errorMessage: any =
            store?.getState()?.authenticationDataSlice?.errorMessage;
          setModalData({
            heading: "Decline Audit Report",
            bodyText: errorMessage
              ? errorMessage
              : "Decline Audit Report failed",
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

  //Api hit for decline audit
  const declineAudit = async (e: any) => {
    e.preventDefault();
    try {
      const declineAuditReport: any = await declineAuditReportTxn({
        postID: postID,
        email: userEmail,
        userAddress: reduxWalletAddress,
        walletAddress: walletAddress,
        auditId: auditId,
        bool: false,
        reason: formik.values.reason,
      });
      if (declineAuditReport?.isFinalized === true) {
        const selectArbiter: any = await selectArbiters({
          emailAddress: userEmail,
          postID: postID,
          reason: formik.values.reason,
        });
        txnRegisterForSubmitReportByPatronForDecline();
        return {
          message: selectArbiter?.message,
          status: selectArbiter?.status,
          txHash: declineAuditReport?.txHash,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  const txnRegisterForSubmitReportByPatronForDecline = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForSubmitReport =
        store.getState().userDataSlice?.transactionHashForSubmitReportDecline;
      const userEmailRedux = store.getState().userDataSlice?.emailAddress;
      const result: any = await transactionRegister(
        userEmailRedux,
        txnHashForSubmitReport?.toString(),
        time,
        AUDIT_REPORT_DECLINE_BY_PATRON
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
      <CommonModal
        heading="Reason"
        className="extend_modal"
        show={show}
        onHide={handleCrossClick}
        crossBtn
      >
        <div className="extend_modal_inner">
          <form>
            <TextArea
              placeholder="0/2000"
              type="textarea"
              inputName="reason"
              id="reason"
              value={formik.values.reason}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={
                <>
                  Description<sup>*</sup>
                </>
              }
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
            <Form.Group className="mt-4">
              <Form.Check
                className="form-check"
                type="checkbox"
                label={
                  <p className="terms">
                    I express my dissatisfaction with the contents of the
                    deliverables of acknowledge the abriter's decision to be
                    final.
                  </p>
                }
                onChange={(e) =>
                  e.target.checked
                    ? setSelectedDissatisfaction(false)
                    : setSelectedDissatisfaction(true)
                }
              />
            </Form.Group>
            <ButtonCustom
              type="submit"
              disabled={selectedDissatisfaction || !formik.dirty}
              title="send"
              className=""
              onClick={(e: any) => handleDeclineAudit(e)}
            />
          </form>
          <div>
            <TransactionModal
              handleClose={handleCloseNew}
              successClose={SuccessCloseNew}
              crossIcon={crossIcon}
              show={showNew}
              modalData={modalData}
              handleFunction={(e: any) => handleDeclineAudit(e)}
            />
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default SubmittedPostModal;
