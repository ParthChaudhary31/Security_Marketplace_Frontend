import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import InputCustom from "../../../Common/Inputs/InputCustom";
import "./Login.scss";
import { Col, Container, Row } from "react-bootstrap";
import login_bg from "../../../../Assets/Images/login_bg.png";
import CommonHeader from "../../../Common/CommonHeader/CommonHeader";

import { useEffect, useState } from "react";
import { EyeIcon } from "../../../../Assets/Images/Icons/SvgIcons";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoginFormComplete, setIsLoginFormComplete] =
    useState<boolean>(false);

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("*This Field is required"),
    password: Yup.string().required("*This Field is required"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => { },
  });
  useEffect(() => {
    if (formik.values.email !== "" && formik.values.password !== "") {
      setIsLoginFormComplete(true)
    } else {
      setIsLoginFormComplete(false)
    }
  }, [formik.values])

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
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus
                </p>
              </div>
            </Col>
            <Col md={12} lg={6}>
              <div className="login_page_box">
                {/* <CommonHeading heading="Login" /> */}
                <h4>Login</h4>
                <p>Fill the below details to login account</p>
                <form onSubmit={formik.handleSubmit}>
                  <InputCustom
                    label="Phone Number Or Email"
                    placeholder="Admin123@gmail.com"
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
                      formik.errors.email ? (
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
                    rightIcon={EyeIcon}
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
                  <Link to="/admin/tfa" className="frgt-pswrd text-end ms-auto">
                    Forgot Password?
                  </Link>
                  <div className="login_page_box_btn mt-4">
                    <ButtonCustom
                      type="button"
                      title="Login"
                      fluid
                      onClick={() => navigate("/admin/dashboard")}
                    />
                    <p className="mt-2 text-center">
                      Don't have an account?{" "}
                      <span>
                        <Link to="/register">Sign up</Link>
                      </span>
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

export default AdminLogin;
