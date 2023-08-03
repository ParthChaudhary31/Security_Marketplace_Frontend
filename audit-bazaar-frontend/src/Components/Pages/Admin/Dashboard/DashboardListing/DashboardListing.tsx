import { Col, Form, Row } from 'react-bootstrap'
import './DashboardListing.scss'
import defaultUserIcon from "../../../../../Assets/Images/defaultUserIcon.png"
import social_img from '../../../../../Assets/Images/Icons/git-hub.svg'
import social_img2 from '../../../../../Assets/Images/Icons/linkndin.svg'
import social_img3 from '../../../../../Assets/Images/Icons/telegram.svg'
import InputCustom from '../../../../Common/Inputs/InputCustom'
import ButtonCustom from '../../../../Common/Button/ButtonCustom'
import TextArea from '../../../../Common/FormInputs/TextArea'
import green_tick from '../../../../../Assets/Images/Icons/green-tick.svg'
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";


const DashboardListing = ({ className }: any) => {

    const auditdata = [
        {
            btn_info: "Smart Contract Audit",
        },
        {
            btn_info: "Penetration testing",
        },
        {
            btn_info: "Performance testing",
        },
    ];

    const socialdata = [
        {
            social_img: social_img,
            link: "Git Hub",
            className: "blue1",
        },
        {
            social_img: social_img2,
            link: "Linked In",
            className: "blue2",
        },
        {
            social_img: social_img3,
            link: "Telegram",
            className: "blue3",
        },
    ];

    const loginSchema = Yup.object().shape({
        address: Yup.string().required("*This Field is required"),
    });
    const formik = useFormik({
        initialValues: {
            text: "",
            amount: "",
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
        },
    });

    return (
        <section className={`dashboardList ${className}`}>
            <div className='dashboardList_data'>
                <div className='dashboardList_data_header'>
                    <div className='dashboardList_data_header_info'>
                        <div className='list_image'>
                            <img src={defaultUserIcon} alt="list-img" />
                        </div>
                        <div className='list_content'>
                            <p>U ID: 27384</p>
                            <h6>Bradley Cooper</h6>
                            <p className='user_email'>brad119@gmail.com</p>
                        </div>
                    </div>
                    <div className='dashboardList_data_header_post'>
                        <p>Posted On: 13-06-2023</p>
                    </div>
                </div>

                <div className='dashboardList_data_audit'>
                    <p className='audit_heading'>Audit Types:</p>
                    <div className='dashboardList_data_audit_data'>
                        {auditdata.map((item) => {
                            return (
                                <div className='dashboard_audit'>
                                    <div className='audit_btn'>
                                        <p>{item.btn_info}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='dashboardList_data_value'>
                    <ul>
                        <li>
                            <h4>Gitlab URL</h4>
                            <p>www.audirbaazar.com</p>
                        </li>
                        <li>
                            <h4>Offered Amount</h4>
                            <p>10k USD</p>
                        </li>
                        <li>
                            <h4>Expected Timeline</h4>
                            <p>20 Days</p>
                        </li>
                        <li>
                            <h4>Payment Status</h4>
                            <p>
                                <img src={green_tick} alt="green-tick" className='green_tick' />
                                Done</p>
                        </li>
                    </ul>
                </div>
                <div className='dashboardList_data_audit'>
                    <p className='audit_heading'>Expected <br />Deliverables:</p>
                    <div className='dashboardList_data_audit_data'>
                        {auditdata.map((item) => {
                            return (
                                <div className='dashboard_audit'>
                                    <div className='audit_btn'>
                                        <p>{item.btn_info}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className='dashboardList_data_description'>
                    <Form>
                        <Form.Group className="textarea_input" controlId="formBasicEmail">
                            <Row>
                                <Col xl={12}>
                                    <TextArea
                                        label="Description"
                                        placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when 
                        looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of 
                        letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop 
                        publishing packages and web page It is a long established fact that a reader 
                        will be distracted by the readable content of a page when looking."
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </div>

                <div className='dashboardList_data_audit'>
                    <p className='audit_heading'>Social Accounts</p>
                    <div className='dashboardList_data_audit_social'>
                        {socialdata.map((item) => {
                            return (
                                <div className='social_account'>
                                    <div className='social_img'>
                                        <img src={item.social_img} alt="social-img" />
                                    </div>
                                    <Link to="/" className={item.className}>{item.link}</Link>
                                </div>
                            )
                        })}
                    </div>
                </div>



                <div className='dashboardList_data_input'>
                    <Form>
                        <Form.Group className="list_input">
                            <Row>
                                <Col xl={6}>
                                    <InputCustom
                                        type="input"
                                        label="Timeline Required"
                                        className="mb-0 max-field"
                                        placeholder="Lorem Ispum"
                                        id="text"
                                        onChange={formik.handleChange}
                                        autoFocus={true}
                                        value={formik.values.text}
                                        isInvalid={formik.touched.text && !!formik.errors.text}
                                        error={
                                            formik.errors.text && formik.touched.text ? (
                                                <span className="error-message">{formik.errors.text}</span>
                                            ) : null
                                        }
                                    >
                                    </InputCustom>
                                </Col>
                                <Col xl={6}>
                                    <InputCustom
                                        type="input"
                                        label="Amount Required"
                                        className="mb-0 max-field"
                                        placeholder="Enter Amount"
                                        id="amount"
                                        onChange={formik.handleChange}
                                        autoFocus={true}
                                        value={formik.values.amount}
                                        isInvalid={formik.touched.text && !!formik.errors.amount}
                                        error={
                                            formik.errors.amount && formik.touched.amount ? (
                                                <span className="error-message">{formik.errors.amount}</span>
                                            ) : null
                                        }
                                        rightIcon={<><p>USD</p></>}
                                    >
                                    </InputCustom>
                                </Col>
                                <div className='input_btns'>
                                    <ButtonCustom
                                        title="Confirm"
                                        type="submit"
                                    />
                                    <ButtonCustom
                                        title="Cancel"
                                        type="submit"
                                        className="bordered"
                                        onClick="/"
                                    />
                                </div>
                            </Row>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </section>
    )
}

export default DashboardListing
