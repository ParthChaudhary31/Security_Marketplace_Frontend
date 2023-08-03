import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import InputCustom from "../../../Common/Inputs/InputCustom";
import "./Login.scss";
import { Col, Container, Form, Row } from "react-bootstrap";
import login_bg from "../../../../Assets/Images/login_bg.png";
import CommonHeader from "../../../Common/CommonHeader/CommonHeader";
import { useEffect } from "react";

import { EyeIcon } from "../../../../Assets/Images/Icons/SvgIcons";

const Register = () => {
  const navigate = useNavigate();
 
  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("*This Field is required"),
    lastname: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("*This Field is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("*This Field is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters ")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      ),
    confirmpassword: Yup.string()
      .required("*This Field is required")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
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
    onSubmit: async (values) => { },
  });

  useEffect(() => {
    if (
      formik.values.name !== "" &&
      formik.values.lastname !== "" &&
      formik.values.email !== "" &&
      formik.values.password !== "" &&
      formik.values.confirmpassword !== ""
    ) {
    }
  }, [formik.values]);

  const handleRegister = async () => {
    try {
        navigate("/admin/dashboard");
      // }
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
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div className="login_page_box">
                <h4>Register</h4>
                <p>Fill the below details to Login account</p>
                <form onSubmit={formik.handleSubmit}>
                  <InputCustom
                    label="Full Name"
                    placeholder="Enter your Full name"
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    autoFocus={true}
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
                    label="Email"
                    placeholder="Enter your Email"
                    id="email"
                    name="email"
                    type="text"
                    onChange={formik.handleChange}
                    autoFocus={true}
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
                  <InputCustom
                    label="Password"
                    placeholder="*************"
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    autoFocus={true}
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
                  <InputCustom
                    label="Confirm Password"
                    placeholder="*************"
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    onChange={formik.handleChange}
                    autoFocus={true}
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
                  />
                  <Form.Group className="mt-4">
                    <Form.Check
                      className="form-check"
                      type="checkbox"
                      label={<p className="terms">By clicking  on register button you agree to our <span>Term & Condition</span> and <span>Privacy Policy</span></p>}
                      onChange={() =>
                         {}
                      }
                    />
                  </Form.Group>
                  <div className="login_page_box_btn mt-4">
                    <ButtonCustom
                      type="button"
                      title="Register"
                      fluid
                      onClick={handleRegister}
                    />
                    <p className="text-center mt-2">
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
