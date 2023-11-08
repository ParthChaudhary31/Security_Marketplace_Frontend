import { useEffect, useState } from "react";
import { Row, Form, Col } from "react-bootstrap";
import "./Post.scss";
import { useFormik } from "formik";
import InputCustom from "../../../Common/Inputs/InputCustom";
import * as Yup from "yup";
import TextArea from "../../../Common/FormInputs/TextArea";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import Select from "../../../Common/Select/Select";
import { useSelector } from "react-redux";
import { UserData } from "../../../../Constants/Interfaces/Authentication/UserData";

import { useNavigate } from "react-router-dom";
import toaster from "../../../Common/Toast";
import {
  REGISTRATION_FALIED,
  WALLET_BALANCE_LOW,
  WALLET_CONNECTION_REQUIRE,
  ZERO_INPUT_ERROR,
} from "../../../../Constants/AlertMessages/ErrorMessages";
import {
  AuditPostTxn,
  nativeTokenTotalSupply,
  userNativeTokenAllowance,
  userNativeTokenApproval,
} from "../../../../Services/contract.service";
import DatePickerCustom from "../../../Common/DatePickerCustom/DatePickerCustom";
import {
  confirmPostAudit,
  registerAudit,
  transactionRegister,
} from "../../../../Api/Actions/user.action";
import {
  BID_TOKEN_DECIMAL,
  ERROR_TXN,
  PENDING_TXN,
  SUCCESS_TXN,
  TRANSACTION_PROCESS,
  TRANSACTION_SUCCESS,
} from "../../../../Constant";
import {
  exponentialToDecimal,
  makeId,
} from "../../../../Services/Helpers/mathhelper";
import store from "../../../../Redux/store";
import { setUserBalance } from "../../../../Redux/userData/userData";
import TransactionModal from "../../../Common/SubmitRequestModal/transaction-modal/transaction-modal/TransactionModal";
import { userBalanceCheck } from "../../../../Services/Helpers/accountValidCheck";
import { setErrorMessage } from "../../../../Redux/authenticationData/authenticationData";
import { AUDIT_POST_CREATED } from "../../../../Constants/TransactionTypes/TransactionTypes";
import { errorCheck } from "../../../../Services/Helpers/errorServices";

const Post = () => {
  const navigate = useNavigate();
  const [checkedType, setCheckedType] = useState<any>([]);
  const [check, setCheck] = useState<any>({ state: false, value: "" });
  const [modalData, setModalData] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });
  const [statusTxn, setStatusTxn] = useState<any>("");
  const [crossIcon, setCrossIcon] = useState<any>(false);
  const [showNew, setShowNew] = useState(false);
  const handleCloseNew = () =>
    statusTxn === 200 ? navigateToProfile() : setShowNew(false);
  const handleShowNew = () => setShowNew(true);
  const SuccessCloseNew = () =>
    statusTxn === 200 ? navigateToProfile() : handleCloseNew();

  ////////////////////txn loder///////////////////////////////
  const userData: UserData = useSelector((state: any) => state?.userDataSlice);
  const isWalletConnected: any = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );
  const reduxWalletAddress = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  const userEmail = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );

  const options = [
    {
      value: "Smart Contract Audit",
      label: (
        <>
          <input
            type="checkbox"
            checked={checkedType.includes("Smart Contract Audit")}
            className="post_checkbox"
            readOnly
          />
          Smart Contract Audit
        </>
      ),
    },
    {
      value: "Penetration Testing",
      label: (
        <>
          <input
            type="checkbox"
            checked={checkedType.includes("Penetration Testing")}
            className="post_checkbox"
            readOnly
          />
          Penetration Testing
        </>
      ),
    },
    {
      value: "Performance Testing",
      label: (
        <>
          <input
            type="checkbox"
            checked={checkedType.includes("Performance Testing")}
            className="post_checkbox"
            readOnly
          />
          Performance Testing
        </>
      ),
    },
  ];

  const auditSchema = Yup.object().shape({
    emailAddress: Yup.string().required("*This Field is required"),
    socialLink: Yup.string()
      .required("*This Field is required")
      .test(
        "valid-social-link",
        "Please enter a valid Telegram or  LinkedIn profile URL.",
        (value) => {
          const telegramRegex = /^(https?:\/\/)?(www\.)?(t\.me\/[^\s/]+)$/;
          const linkedinRegex =
            /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|profile)\/[^\s/]+\/?$/;
          return telegramRegex?.test(value) || linkedinRegex?.test(value);
        }
      ),
    gitHub: Yup.string()
      .required("*This Field is required")
      .matches(
        /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/tree\/[A-Za-z0-9_.-\/-]+$/,
        "Invalid GitHub repository URL"
      ),
    auditType: Yup.array()
      .of(Yup.string())
      .min(1, "Please Select At Least One Audit Type")
      .required("*This Field Is Required"),
    offerAmount: Yup.string().required("*This Field Is Required"),

    description: Yup.string()
      .required("*This Field Is Required")
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
    estimatedDelivery: Yup.string().required("*This Field is required"),
  });

  const fullname = `${userData?.firstName} ${" "}${
    userData?.lastName == null ? "" : userData?.lastName
  }`;
  const formik = useFormik({
    initialValues: {
      name: fullname,
      emailAddress: userData?.emailAddress,
      gitHub: "",
      auditType: "",
      offerAmount: "",
      estimatedDelivery: "",
      description: "",
      socialLink: "",
      url: "",
    },
    validationSchema: auditSchema,
    onSubmit: (values) => {},
  });

  // call loader handleAuditRequest
  const handleAuditRequest = async (e: any) => {
    if (isWalletConnected) {
      try {
        handleShowNew();
        setModalData({
          heading: "Audit Request",
          bodyText: TRANSACTION_PROCESS,
          status: PENDING_TXN,
          txHash: null,
        });

        const response: any = await newAuditRequestCall(e);
        if (response?.status === 200) {
          setModalData({
            heading: TRANSACTION_SUCCESS,
            bodyText: response?.message,
            status: SUCCESS_TXN,
            txHash: response?.txHash,
          });
          setStatusTxn(response?.status);
          setCrossIcon(true);
        } else {
          const errorMessage: any =
            store?.getState()?.authenticationDataSlice?.errorMessage;
          setModalData({
            heading: "Audit Request",
            bodyText: errorMessage ? errorMessage : "Audit Request Failed",
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

  //allowance check
  const tokenAllowanceForAddress = async (walletAddress: any) => {
    let userAllowance: any = await userNativeTokenAllowance(walletAddress);
    userAllowance = userAllowance?.toHuman();
    userAllowance = userAllowance?.Ok;
    return userAllowance;
  };

  const navigateToProfile = () => {
    navigate("/admin/my-profile");
  };
  //Audit request first call fn
  const newAuditRequestCall = async (e: any) => {
    if (isWalletConnected) {
      const userBalDecimalValue: any = await userBalanceCheck(
        reduxWalletAddress
      );
      store?.dispatch(setUserBalance(userBalDecimalValue)); //balance update while txn
      const userInput: any = formik?.values?.offerAmount;
      if (userInput === 0) {
        toaster.error(ZERO_INPUT_ERROR);
        return;
      }
      if (userInput > userBalDecimalValue / 10 ** BID_TOKEN_DECIMAL) {
        errorCheck({message:WALLET_BALANCE_LOW});
        return;
      }
      const resultAllowance = await tokenAllowanceForAddress(
        reduxWalletAddress
      );
      //user balance update while TNX
      let auditCallresult: any;
      try {
        //user allowance
        const userAllowanceInt: any = parseInt(resultAllowance);
        const ContractDecimalallowance: any =
          userAllowanceInt * 10 ** BID_TOKEN_DECIMAL;
        const userDecimalAllowance: any = exponentialToDecimal(
          ContractDecimalallowance
        );
        //input amount check
        const ContractDecimalValue: any = userInput * 10 ** BID_TOKEN_DECIMAL;
        const userDecimalValue: any =
          exponentialToDecimal(ContractDecimalValue);
        //totalsupply for Approval
        const Totalsupply: any = await nativeTokenTotalSupply(
          reduxWalletAddress
        );
        const toHumanTotalSupply: any = Totalsupply.toHuman();
        const ContractTotalsupply: any = toHumanTotalSupply?.Ok;
        const ContractTotalsupplyDecimal = BigInt(
          ContractTotalsupply.replace(/,/g, "").replace(/^0+/, "")
        ); // Remove commas and leading zeros
        const decimalValueTotalSupply: any = exponentialToDecimal(
          ContractTotalsupplyDecimal
        );

        //conditions on allowance and approval
        if (userDecimalAllowance < userDecimalValue || userAllowanceInt === 0) {
          setModalData({
            heading: "Approval",
            bodyText: TRANSACTION_PROCESS,
            status: PENDING_TXN,
            txHash: null,
          });
          const callApprovalResult: any = await userNativeTokenApproval(
            reduxWalletAddress,
            decimalValueTotalSupply,
            e
          );
          if (callApprovalResult === true) {
            try {
              const finalTxnResult = await FinalAuditRequest();
              auditCallresult = finalTxnResult;
              return auditCallresult;
            } catch (error: any) {
              console.log(error);
            }
          }
        } else if (userDecimalAllowance >= userDecimalValue) {
          try {
            const finalTxnResult = await FinalAuditRequest();
            auditCallresult = finalTxnResult;
            return auditCallresult; //return
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toaster.error(WALLET_CONNECTION_REQUIRE);
    }
  };

  // CREATE A NEW AUDIT
  const FinalAuditRequest = async () => {
    try {
      setModalData({
        heading: "Audit Request Creating",
        bodyText: TRANSACTION_PROCESS,
        status: PENDING_TXN,
        txHash: null,
      });
      // Approval check
      let salt = await makeId(10);
      let preRegisterAudit: any;
      let auditPost: any;
      let confirmPost: any;
      try {
        preRegisterAudit = await registerAudit({
          name: formik.values.name,
          emailAddress: formik.values.emailAddress,
          gitHub: formik.values.gitHub.trim(),
          auditType: checkedType,
          offerAmount: formik.values.offerAmount,
          estimatedDelivery: formik.values.estimatedDelivery, // Use the formatted date
          description: formik.values.description.trim(),
          socialLink: formik.values.socialLink.trim(),
          userAddress: reduxWalletAddress,
          salt: Number(salt),
        });
      } catch (error) {
        console.log(error);
      }
      //AuditPostTxn
      if (preRegisterAudit?.status === 200) {
        try {
          auditPost = await AuditPostTxn({
            salt: Number(salt),
            offerAmount: formik.values.offerAmount,
            estimatedDelivery: formik.values.estimatedDelivery, // Use the formatted date
            userAddress: reduxWalletAddress,
          });
        } catch (error) {
          console.log(error);
        }
        //confirmPostAudit
        if (auditPost?.isFinalized === true) {
          try {
            confirmPost = await confirmPostAudit({
              txHash: auditPost?.txHash,
              salt: Number(salt),
              currentAuditId: (auditPost?.AuditId).toString(),
            });
            if (confirmPost.status === 200) {
              await transactionRegisterForPostCreated();
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        toaster.error(REGISTRATION_FALIED);
      }
      return {
        status: confirmPost?.status,
        txHash: auditPost?.txHash,
        message: confirmPost?.message,
      };
    } catch (error) {
      console.log(error);
    }
  };
//TXN REGISTER FOR POST CREATED(AUDIT REQUEST)
  const transactionRegisterForPostCreated = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForPostLatest =
        store.getState().userDataSlice?.transactionHashForCreatePost;
      const result: any = await transactionRegister(
        userEmail,
        txnHashForPostLatest?.toString(),
        time,
        AUDIT_POST_CREATED
      );
      if (result?.status === 200) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
//AUDIT TYPE CHECKBOX SELECTION
  const updateCheckedTypesForAuditType = (options: any) => {
    setCheckedType(options?.map((opt: any) => opt?.value?.toString()));
    formik.setFieldValue(
      "auditType",
      options?.map((opt: any) => opt.value.toString())
    );
  };
  const handleCheckboxChangeForAuditType = (options: any) => {
    updateCheckedTypesForAuditType(options);
    formik.setFieldTouched("auditType", true);
  };

  useEffect(() => {
    if (check.value) formik.initialValues.estimatedDelivery = check?.value;
  }, [check?.state]);

  useEffect(() => {}, [formik.values, formik.touched.auditType]);

  return (
    <section className="Post">
      <h4 className="common-heading">Audit Request</h4>
      <div className="Post_request">
        <h6>Fill in the Details</h6>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="Post_request_inputList">
            <Row>
              <Col sm={6}>
                <InputCustom
                  type="text"
                  label={<>Full Name</>}
                  id="name"
                  InputName="post_input"
                  placeholder="Enter Full Name"
                  onChange={formik.handleChange}
                  readOnly={true}
                  value={formik.values.name}
                  isInvalid={formik.touched.name && !!formik.errors.name}
                  error={
                    formik.errors.name && formik.touched.name ? (
                      <span className="error-message">
                        {formik.errors.name}
                      </span>
                    ) : null
                  }
                  disabled
                ></InputCustom>
              </Col>
              <Col sm={6}>
                <InputCustom
                  disabled
                  type="emailAddress"
                  label={<>Email</>}
                  id="emailAddress"
                  InputName="post_input"
                  placeholder="Enter Email Address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  readOnly={true}
                  value={formik.values.emailAddress}
                  error={
                    formik.errors.emailAddress &&
                    formik.touched.emailAddress ? (
                      <span className="error-message">
                        {formik.errors.emailAddress}
                      </span>
                    ) : null
                  }
                ></InputCustom>
              </Col>

              <Col sm={6}>
                <Form.Label>
                  Audit Types<sup>*</sup>
                </Form.Label>
                <Select
                  placeholder="Select Audit Types"
                  options={options}
                  defaultValue={options[""]}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isMulti
                  onBlur={formik.handleBlur}
                  className="select_option mb-0"
                  onChange={handleCheckboxChangeForAuditType}
                  error={
                    formik.errors.auditType && formik.touched.auditType ? (
                      <span className="error-message">
                        {formik.errors.auditType}
                      </span>
                    ) : null
                  }
                />
              </Col>
              <Col sm={6}>
                <InputCustom
                  className="social_link"
                  type="socialLink"
                  label={
                    <>
                      Social Link<sup>*</sup>
                    </>
                  }
                  InputName="socialLink"
                  id="socialLink"
                  placeholder="Social Link"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.socialLink}
                  isInvalid={
                    formik.touched.socialLink && !!formik.errors.socialLink
                  }
                  error={
                    formik.errors.socialLink && formik.touched.socialLink ? (
                      <span className="error-message">
                        {formik.errors.socialLink}
                      </span>
                    ) : null
                  }
                ></InputCustom>
              </Col>

              <Col sm={6}>
                <InputCustom
                  type="gitHub"
                  label={
                    <>
                      Git Hub URL<sup>*</sup>
                    </>
                  }
                  id="gitHub"
                  InputName="post_input"
                  placeholder="Github Repo Url"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gitHub}
                  isInvalid={formik.touched.gitHub && !!formik.errors.gitHub}
                  error={
                    formik.errors.gitHub && formik.touched.gitHub ? (
                      <span className="error-message">
                        {formik.errors.gitHub}
                      </span>
                    ) : null
                  }
                ></InputCustom>
              </Col>

              <Col sm={6}>
                <InputCustom
                  type="number"
                  label={
                    <>
                      Offered Amount<sup>*</sup>
                    </>
                  }
                  InputName="offerAmount"
                  id="offerAmount"
                  placeholder="Enter Amount"
                  disableDecimal="."
                  onChange={(e: any) => {
                    e.preventDefault();
                    const { value } = e.target;
                    const regex = /^(\d+)?$/;
                    if (regex.test(value.toString())) {
                      formik.handleChange(e);
                    }
                  }}
                  maxLength={8}
                  disablePaste={true}
                  onBlur={formik.handleBlur}
                  value={formik.values.offerAmount}
                  isInvalid={
                    formik.touched.offerAmount && !!formik.errors.offerAmount
                  }
                  error={
                    formik.errors.offerAmount && formik.touched.offerAmount ? (
                      <span className="error-message">
                        {formik.errors.offerAmount}
                      </span>
                    ) : null
                  }
                  rightIcon={
                    <>
                      <p>USD</p>
                    </>
                  }
                ></InputCustom>
              </Col>
              <Col sm={6}>
                <div className="post_date">
                  <DatePickerCustom
                    type="date"
                    label={
                      <>
                        Expected Timeline<sup>*</sup>
                      </>
                    }
                    InputName="estimatedDelivery"
                    id="estimatedDelivery"
                    Dateclass="post_inputNew"
                    placeholder="Enter Estimated Delivery"
                    onClick={formik.handleBlur}
                    onChange={formik.handleChange}
                    data={formik.values}
                    dateType="estimatedDelivery"
                    checkSetter={setCheck}
                    check={check}
                    dateFormat="dd/MM/yyyy"
                    onBlur={formik.handleBlur}
                    value={formik.values.estimatedDelivery}
                    isInvalid={
                      formik.touched.estimatedDelivery &&
                      !!formik.errors.estimatedDelivery
                    }
                    error={
                      formik.errors.estimatedDelivery &&
                      formik.touched.estimatedDelivery ? (
                        <span className="error-message">
                          {formik.errors.estimatedDelivery}
                        </span>
                      ) : null
                    }
                  ></DatePickerCustom>
                </div>
              </Col>

              <Col xl={12}>
                <TextArea
                  className="mt-3"
                  type="textarea"
                  label={
                    <>
                      Description<sup>*</sup>
                    </>
                  }
                  inputName="description"
                  id="description"
                  placeholder="Describe about the project and it's requirment"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  isInvalid={formik.errors.description}
                  onBlur={formik.handleBlur}
                  error={
                    formik.errors.description && formik.touched.description ? (
                      <span className="error-message">
                        {formik.errors.description}
                      </span>
                    ) : null
                  }
                ></TextArea>
              </Col>
              <Col xl={12}>
                <div className="login_page_box_btn mt-4">
                  <ButtonCustom
                    title="Confirm"
                    type="submit"
                    fluid
                    className="post_btn"
                    onClick={(e: any) => handleAuditRequest(e)}
                    disabled={
                      !formik.isValid ||
                      !formik.touched.auditType ||
                      !formik.dirty
                    }
                  />
                </div>
              </Col>
            </Row>
          </Form.Group>
        </Form>
        <div>
          <TransactionModal
            handleClose={handleCloseNew}
            successClose={SuccessCloseNew}
            crossIcon={crossIcon}
            show={showNew}
            modalData={modalData}
            handleFunction={(e: any) => handleAuditRequest(e)}
          />
        </div>
      </div>
    </section>
  );
};

export default Post;
