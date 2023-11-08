import React, { Dispatch , useState } from "react";
import "./SubmitRequestModal.scss";
import CommonModal from "../CommonModal/CommonModal";
import { AddIcon, DeleteIcon } from "../../../Assets/Images/Icons/SvgIcons";
import ButtonCustom from "../Button/ButtonCustom";
import InputCustom from "../Inputs/InputCustom";
import { useDispatch, useSelector } from "react-redux";
import {
  submitAuditReport,
  submitAuditReportUser,
  transactionRegister,
} from "../../../Api/Actions/user.action";
import { submitAuditReportTxn } from "../../../Services/contract.service";
import toaster from "../Toast";
import { WALLET_CONNECTION_REQUIRE } from "../../../Constants/AlertMessages/ErrorMessages";
import { makeId } from "../../../Services/Helpers/mathhelper";
import { ERROR_TXN, PENDING_TXN, PLATFORM_FEE_PERCENTAGE, SUCCESS_TXN, TRANSACTION_PROCESS, TRANSACTION_SUCCESS } from "../../../Constant";
import {
  setAuditorReport,
  setSubmitAuditSuccess,
} from "../../../Redux/Audit/Audit.slice";
import TransactionModal from "./transaction-modal/transaction-modal/TransactionModal";
import store from "../../../Redux/store";
import { setErrorMessage } from "../../../Redux/authenticationData/authenticationData";
import { SUBMIT_AUDIT_REPORT_BY_AUDITOR } from "../../../Constants/TransactionTypes/TransactionTypes";

const SubmitRequestModal = ({
  show,
  onHide,
  auditId,
  offerAmount,
  auditType,
}) => {
  const [auditReports, setAuditReports] = useState<File[]>([]);
  const [errors, setErrors] = useState<any>();
  const dispatch: Dispatch<any> = useDispatch();
  const [modalData, setModalData] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });
  const [closeModal, setCloseModal] = useState<any>("");
  const [crossIcon, setCrossIcon] = useState<any>(false);
  const [showNew, setShowNew] = useState(false);
  const handleCloseNew = () =>
    closeModal === 200 ? onHide() : setShowNew(false);
  const handleShowNew = () => setShowNew(true);
  const SuccessCloseNew = () =>
    closeModal === 200 ? onHide() : handleCloseNew();

  const emailAddress = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const isWalletConnected: any = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );
  const reduxWalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  const userEmail = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );

  const handleSubmitAuditCall = async (e: any) => {
    if (isWalletConnected) {
      try {
        handleShowNew();
        setModalData({
          heading: "Audit Report Submitting",
          bodyText: TRANSACTION_PROCESS,
          status: PENDING_TXN,
          txHash: null,
        });
        const response: any = await handleSubmitAudit(e);
        if (response?.status === 200) {
          setModalData({
            heading: TRANSACTION_SUCCESS,
            bodyText: response?.message,
            status: SUCCESS_TXN,
            txHash: response?.txHash,
          });
          dispatch(setSubmitAuditSuccess(response?.txHash));
          setCloseModal(response?.status);
          setCrossIcon(true);
        } else {
          const errorMessage:any = store?.getState()?.authenticationDataSlice?.errorMessage;
          setModalData({
            heading: "Audit Report Submitting ",
            bodyText: errorMessage?errorMessage:"Audit Report Submitting Failed",
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

  const handleAuditReport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      const newErrors: string[] = [];
      const allowedFileTypes = ["application/pdf"];

      const validFiles: File[] = Array.from(selectedFiles).filter(
        (file: File) => {
          if (!allowedFileTypes.includes(file.type)) {
            newErrors.push(`${file.name} is not a valid PDF file.`);
            return false;
          }
          if (file.size > 1024 * 1024) {
            newErrors.push(
              `${file.name} exceeds the maximum size limit (1MB).`
            );
            return false;
          }
          return true;
        }
      );
      setErrors(newErrors);
      setAuditReports((prevReports) => [...prevReports, ...validFiles]);
    }
    const fileInput: any = document.getElementById("submit");
    if (fileInput) {
      fileInput.value = ""; // Reset the input element
    }
  };

  //call Api for submit Audit
  const handleSubmitAudit = async (e: React.FormEvent<HTMLButtonElement>) => {

    e.preventDefault();
    let saltx = await makeId(10);
    let submitReportResult: any;
    let submitApiResult: any;
    const form: any = new FormData();
    auditReports.forEach((file, index) => {
      form.append("submit", file); // for single report submit.
      // form.append(`submit${index + 1}`, file); // Appending files as submit1, submit2, submit3, etc.
    });

    form.append("emailAddress", emailAddress);
    form.append("postID", auditId);
    form.append("salt", saltx);

    try {
      if (auditReports?.length === auditType?.length) {
        const resultApi = await submitAuditReportUser(form);
        if (resultApi?.status === 200) {
          try {
            submitReportResult = await submitAuditReportTxn({
              auditId: resultApi?.data?.currentAuditId,
              userAddress: reduxWalletAddress,
              ipfsHash: "lslsld",
            });
          } catch (error) {
            console.log(error);
          }
        }
        if (submitReportResult?.isFinalized === true) {
          try {
              dispatch(setAuditorReport(resultApi?.data?.submit));
              submitApiResult = await submitAuditReport({
                emailAddress: emailAddress,
                postID: auditId,
                txHash: submitReportResult?.txHash,
                salt: saltx,
              });
              transactionRegisterForSubmitReport();
          } catch (error) {
            console.error(error);
          }
        }

        return {
          message: submitApiResult?.message,
          status: submitApiResult?.status,
          txHash: submitReportResult?.txHash,
        };
      } else {
        setErrors(`Please add at least ${auditType?.length} file to upload.`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setAuditReports((prevReports) =>
      prevReports.filter((_, index) => index !== indexToRemove)
    );
  };
  const transactionRegisterForSubmitReport = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForSubmitReport =
        store.getState().userDataSlice?.transactionHashForSubmitReport;
      const result: any = await transactionRegister(
        userEmail,
        txnHashForSubmitReport?.toString(),
        time,
        SUBMIT_AUDIT_REPORT_BY_AUDITOR
      );
      if (result?.status === 200) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    const fileInput: any = document.getElementById("submit");
    if (fileInput) {
      fileInput.value = ""; // Reset the input element
    }
    setAuditReports([]);
    setErrors([]);
  };

  const disable = auditReports.length !== auditType.length;
  const maxReportCount = auditType.length;
  const remainingReports = auditReports.length === maxReportCount;

  return (
    <>
      <CommonModal
        show={show}
        className="submit_modal"
        heading="Submit Audit"
        crossBtn
        onHide={() => {
          handleDelete();
          onHide();
        }}
      >
        {auditReports.length > 3 && (
          <p className="warning_msg army-2">
            You cannot upload more than three reports.
          </p>
        )}

        <p className="report_line">
          You have to submit <span>{auditType?.length}</span> reports
        </p>
        <ul className="submit_modal_inner">
          <li>
            <p>Audit ID: {auditId}</p>
            <div className="d-block text-end">
              {remainingReports ? (
                <button disabled className="add_btn">
                  <AddIcon />
                  <span className="ms-3 mt-2">Add</span>
                </button>
              ) : (
                <button className="add_btn">
                  <InputCustom
                    id="submit"
                    name="submit"
                    type="file"
                    onChange={handleAuditReport}
                    accept=".pdf"
                    placeholder={"Choose Your Name"}
                    multiple
                  />
                  <AddIcon />
                  <span className="ms-3 mt-2">Add</span>
                </button>
              )}

              <div>
                {errors?.map((error:any, index:any) => (
                  <p className="text-danger my-2" key={index}>
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </li>

          <ul>
            {auditReports?.map((file: File, index: number) => (
              <li
                className="text-dark d-flex align-items-center justify-content-between"
                key={index}
              >
                <span>{file.name}</span>
                <button onClick={() => handleRemoveFile(index)}>
                  <DeleteIcon />
                </button>
              </li>
            ))}
          </ul>
        </ul>
        <p className="report_line">
          You will recieve{" "}
          <span>
            {offerAmount - (PLATFORM_FEE_PERCENTAGE * offerAmount) / 100} USD
          </span>{" "}
          after deduction of platform fees
        </p>
        <div className="btn_sec">
          <ButtonCustom
            onClick={() => {
              handleDelete();
              onHide();
            }}
            title="Cancel"
            className="bordered"
          />

          <ButtonCustom
            title='Submit'
            onClick={(e: any) => {
              handleSubmitAuditCall(e);
              handleDelete();
            }}
            disabled={disable}
          />
        </div>
        <div>
          <TransactionModal
            handleClose={handleCloseNew}
            successClose={SuccessCloseNew}
            crossIcon={crossIcon}
            show={showNew}
            modalData={modalData}
            handleFunction={(e:any) => handleSubmitAuditCall(e)}
          />
        </div>
      </CommonModal>
    </>
  );
};

export default SubmitRequestModal;
