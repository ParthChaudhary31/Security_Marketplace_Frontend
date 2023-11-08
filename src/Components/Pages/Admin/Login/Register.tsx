import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import InputCustom from "../../../Common/Inputs/InputCustom";
import "./Login.scss";
import { Col, Container, Form, Row } from "react-bootstrap";
import login_bg from "../../../../Assets/Images/login_bg.png";
import CommonHeader from "../../../Common/CommonHeader/CommonHeader";
import { registerUser } from "../../../../Api/Actions/user.action";
import { useState } from "react";
import store from "../../../../Redux/store";
import {
  setEmailAddress,
  setFirstName,
  setlastName,
} from "../../../../Redux/userData/userData";
import {
  setIsLoggedIn,
  setJwtToken,
} from "../../../../Redux/authenticationData/authenticationData";
import { RegisterResponse } from "../../../../Constants/Interfaces/ApiResponses/RegisterResponse";
import { EyeIcon } from "../../../../Assets/Images/Icons/SvgIcons";
import Password from "../../../Common/Inputs/Password";

const Register = () => {
  const navigate = useNavigate();
  const [termsConditionsAccepted, setTermsConditionsAccepted] =
    useState<boolean>(false);

  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(25, "Too Long!")
      .required("*This Field is Required.")
      .matches(
        /^[^\d\s]+$/,
        "Numeric Characters And Spaces Are Not Allowed In The Name."
      ),
    lastname: Yup.string()
      .nullable()
      .min(2, "Too Short!")
      .max(25, "Too Long!")
      .matches(
        /^[^\d\s]+$/,
        "Numeric Characters And Spaces Are Not Allowed In The Name."
      ),
    email: Yup.string()
      .email("Invalid Email.")
      .required("*This Field Is Required.")
      .max(300, "Maximum 300 Characters Are Allowed For Email.")
      .test("No-Consecutive-Dots", "Invalid Email", (value) => {
        if (!value) return true;
        return !/\.{2,}/.test(value);
      }),
    password: Yup.string()
      .required("*This Field Is Required")
      .min(8, "*Password Must Contain 8-24 Characters.")
      .max(24, "*Password Must Contain 8-24 Characters.")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/])[A-Za-z\d~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$/,
        "Password Must Contain At Least 8 Characters Including At Least One Uppercase, One Lowercase, One Number And One Special Case Character. Blank Spaces Are Not Allowed."
      ),
    confirmpassword: Yup.string()
      .required("*This Field Is Required.")
      .oneOf([Yup.ref("password")], "*Passwords Do Not Match."),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {},
  });

  const handleRegister = async () => {
    try {
      const result: RegisterResponse = await registerUser({
        firstName: formik.values.name.trim(),
        lastName: formik.values.lastname || "",
        emailAddress: formik.values.email.trim(),
        password: formik.values.password.trim(),
        confirmPassword: formik.values.confirmpassword.trim(),
      });
      if (result?.status === 200) {
        store.dispatch(setJwtToken(result?.token));
        store.dispatch(setIsLoggedIn(true));
        store.dispatch(setFirstName(result?.data?.firstName));
        store.dispatch(setlastName(result?.data?.lastName));
        store.dispatch(setEmailAddress(result?.data?.emailAddress));
        navigate("/");
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
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="login_page_img">
                <img src={login_bg} alt="login_bg" />
                <p>
                  AuditBazaar is a security marketplace that acts as a platform
                  facilitating the engagement of Auditors and Project
                  ecosystems.
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div className="login_page_box">
                <h4>Register</h4>
                <p className="login_filler">
                  Fill the below details to Login account
                </p>
                <form onSubmit={formik.handleSubmit}>
                  <InputCustom
                    label={
                      <>
                        First Name<sup>*</sup>
                      </>
                    }
                    placeholder="Enter your First name"
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    isInvalid={
                      formik.touched.name && formik.errors.name
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.name && formik.touched.name ? (
                        <span className="error-message">
                          {formik.errors.name}
                        </span>
                      ) : null
                    }
                  />
                  <InputCustom
                    label="Last Name"
                    placeholder="Enter your Last name"
                    id="lastname"
                    name="lastname"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastname}
                    isInvalid={
                      formik.touched.lastname && formik.errors.lastname
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.lastname && formik.touched.lastname ? (
                        <span className="error-message">
                          {formik.errors.lastname}
                        </span>
                      ) : null
                    }
                  />
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
                      formik.errors.email && formik.touched.email ? (
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
                    placeholder="Enter your Password"
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    error={
                      formik.errors.password && formik.touched.password ? (
                        <span className="error-message">
                          {formik.errors.password}
                        </span>
                      ) : null
                    }
                    rightIcon={EyeIcon}
                  />
                  <Password
                    label={
                      <>
                        Confirm Password<sup>*</sup>
                      </>
                    }
                    placeholder="Confirm your Password"
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmpassword}
                    isInvalid={
                      formik.touched.confirmpassword &&
                      formik.errors.confirmpassword
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.confirmpassword &&
                      formik.touched.confirmpassword ? (
                        <span className="error-message">
                          {formik.errors.confirmpassword}
                        </span>
                      ) : null
                    }
                    rightIcon={EyeIcon}
                    disablePaste={true}
                  />
                  <Form.Group className="mt-4">
                    <Form.Check
                      className="form-check"
                      type="checkbox"
                      label={
                        <p className="terms">
                          By clicking on register button you agree to our{" "}
                          <Link to="/terms&&Conditons">
                            <span>Term & Condition </span>
                          </Link>
                          {""}
                          and{" "}
                          <Link to="/privacyPolicy">
                            <span>Privacy Policy</span>
                          </Link>
                        </p>
                      }
                      onChange={(e) =>
                        e.target.checked
                          ? setTermsConditionsAccepted(true)
                          : setTermsConditionsAccepted(false)
                      }
                    />
                  </Form.Group>
                  <div className="login_page_box_btn mt-4">
                    <ButtonCustom
                      type="submit"
                      title="Register"
                      fluid
                      onClick={handleRegister}
                      disabled={
                        !formik.isValid ||
                        !termsConditionsAccepted ||
                        !formik.dirty
                      }
                    />
                    <p className="tuseFormikContextext-center mt-2">
                      Already have an account? click here to{" "}
                      <Link to="/">
                        <span> login</span>
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Register;
