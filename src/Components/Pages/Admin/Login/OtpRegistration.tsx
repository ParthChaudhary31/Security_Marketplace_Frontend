import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import "./Login.scss";
import { Col, Container, Row } from "react-bootstrap";
import login_bg from "../../../../Assets/Images/login_bg.png";
import OTPInput from "react-otp-input";
import { BackIcon } from "../../../../Assets/Images/Icons/SvgIcons";
import CommonHeader from "../../../Common/CommonHeader/CommonHeader";

const OtpRegistration = () => {
    const navigate = useNavigate();

    const otpSchema = Yup.object().shape({
        address: Yup.string().required("*This Field is required"),
    });
    const formik = useFormik({
        initialValues: {
            address: "",
            password: "",
        },
        validationSchema: otpSchema,
        onSubmit: async (values) => {
            
        },
    });

    const [otp, setOtp] = useState('');

    return (

        <>
            <section className="login_page">
                <Container>
                    <CommonHeader />
                    <Row className="align-items-center">
                        <Col md={12} lg={6}>
                            <div className="login_page_img">
                                <img src={login_bg} alt="login_bg" />
                                <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus</p>
                            </div>
                        </Col>
                        <Col md={12} lg={6}>
                            <div className="login_page_box_otp">
                                {/* <CommonHeading heading="Login" /> */}
                                <Link to="/" className="mb-5"><BackIcon /></Link>
                                <h4>OTP Verification</h4>
                                <p className="mb-5">We have sent an otp to thr email address: abc@xyz.com</p>
                                <h6>Enter Your 6 Digit OTP</h6>
                                <form onSubmit={formik.handleSubmit}>
                                    <OTPInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={6}
                                        renderSeparator={<span>-</span>}
                                        renderInput={(props) => <input {...props} />}

                                    />

                                    <div className="login_page_box_btn mt-4">
                                        <ButtonCustom
                                            className="mt-5"
                                            type="button"
                                            title="Submit"
                                            fluid
                                            onClick={() => navigate("/admin/dashboard")}
                                        />
                                        <ButtonCustom
                                            className="btn-transparent"
                                            type="button"
                                            title="Resend OTP"
                                            fluid
                                            onClick={() => navigate("/admin/dashboard")}
                                        />
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

export default OtpRegistration;
