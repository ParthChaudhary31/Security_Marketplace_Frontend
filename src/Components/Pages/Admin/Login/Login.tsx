import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import InputCustom from "../../../Common/Inputs/InputCustom";
import "./Login.scss";
import { Col, Container, Row } from "react-bootstrap";
import login_bg from "../../../../Assets/Images/login_bg.png";
import CommonHeader from "../../../Common/CommonHeader/CommonHeader";
import { userLogin } from "../../../../Api/Actions/user.action";
import {
  setIsLoggedIn,
  setJwtToken,
  setWalletAddress,
} from "../../../../Redux/authenticationData/authenticationData";
import { LoginResponse } from "../../../../Constants/Interfaces/ApiResponses/LoginResponses";
import {
  setBio,
  setEmailAddress,
  setFirstName,
  setGitHub,
  setLinkdIn,
  setProfilePicture,
  setTelegram,
  setlastName,
} from "../../../../Redux/userData/userData";
import { Dispatch, useEffect, useState } from "react";
import { CloseEye } from "../../../../Assets/Images/Icons/SvgIcons";
import Password from "../../../Common/Inputs/Password";
import CommonModal2FA from "../../../Common/2FA/2FA/CommonModal2FA";
import { useDispatch } from "react-redux";
import {
  setTwoFactorStatus,
} from "../../../../Redux/2FA/TwoFA.slice";

const AdminLogin = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();
  const [isLoginFormComplete, setIsLoginFormComplete] =
    useState<boolean>(false);
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Input A Valid Email.")
      .required("*This Field Is Required.")
      .max(300, "Maximum 300 Characters Are Allowed For Email.")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email"
      ),
    password: Yup.string().required("*This Field Is Required."),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {},
  });
  useEffect(() => {
    if (formik.values.email !== "" && formik.values.password !== "") {
      setIsLoginFormComplete(true);
    } else {
      setIsLoginFormComplete(false);
    }
  }, [formik.values]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogin = async () => {
    try {
      const result: LoginResponse = await userLogin({
        emailAddress: formik.values.email.trim(),
        password: formik.values.password.trim(),
      });

      if (result?.status === 200) {
        dispatch(setJwtToken(result?.token));
        dispatch(setIsLoggedIn(true));
        dispatch(setEmailAddress(result?.data?.emailAddress));
        dispatch(setFirstName(result?.data?.firstName));
        dispatch(setlastName(result?.data?.lastName));
        dispatch(setGitHub(result?.data?.gitHub));
        dispatch(setLinkdIn(result?.data?.linkedIn));
        dispatch(setProfilePicture(result?.data?.profilePicture));
        dispatch(setTelegram(result?.data?.telegram));
        dispatch(setWalletAddress(result?.data?.walletAddress));
        dispatch(setBio(result?.data?.bio));
        dispatch(setTwoFactorStatus(result?.data?.twoFactorAuthenticationStatus));
        if (result?.data?.twoFactorAuthenticationStatus === true) {
          setShowModal(true); // Open the modal for two-factor authentication
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="login_page">
        <Container>
          <CommonHeader />
          <Row>
            <Col md={12} lg={6}>
              <div className="login_page_img">
                <img src={login_bg} alt="login_bg" />
                <p>
                  AuditBazaar is a security marketplace that acts as a platform
                  facilitating the engagement of Auditors and Project
                  ecosystems.
                </p>
              </div>
            </Col>
            <Col md={12} lg={6}>
              <div className="login_page_box">
                <h4>Login</h4>
                <p className="login_filler">
                  Fill the below details to login account
                </p>
                <form onSubmit={formik.handleSubmit}>
                  <InputCustom
                    label={
                      <>
                        Email<sup>*</sup>
                      </>
                    }
                    placeholder="Enter your Email"
                    id="email"
                    name="email"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    isInvalid={
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.email ? (
                        <span className="error-message">
                          {formik.errors.email}
                        </span>
                      ) : null
                    }
                  />
                  <Password
                    label={
                      <>
                        Password<sup>*</sup>
                      </>
                    }
                    placeholder="Enter your password"
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    rightIcon={<CloseEye />}
                    isInvalid={
                      formik.touched.password && formik.errors.password
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.password && formik.touched.password ? (
                        <span className="error-message">
                          {formik.errors.password}
                        </span>
                      ) : null
                    }
                  />
                  <div className="login_page_box_btn mt-4">
                    {}
                    <ButtonCustom
                      type="submit"
                      title="Login"
                      fluid
                      onClick={handleLogin}
                      disabled={
                        isLoginFormComplete && formik.isValid === true
                          ? false
                          : true
                      }
                    />
                    <p className="mt-2 text-center">
                      Don't have an account?
                      <span>
                        <Link to="/register">Sign up</Link>
                      </span>
                    </p>
                  </div>
                  <CommonModal2FA
                    show={showModal}
                    onHide={handleCloseModal}
                    heading="Verify OTP and Forgot 2FA"
                  />
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdminLogin;
