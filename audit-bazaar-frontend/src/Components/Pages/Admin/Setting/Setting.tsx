import "./Setting.scss";
import { Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import InputCustom from "../../../Common/Inputs/InputCustom";
import defaultUserIcon from "../../../../Assets/Images/defaultUserIcon.png";
import upload_img from "../../../../Assets/Images/upload-img.svg";
import social_img from "../../../../Assets/Images/Icons/git-hub.svg";
import social_img2 from "../../../../Assets/Images/Icons/linkndin.svg";
import social_img3 from "../../../../Assets/Images/Icons/telegram.svg";
import TextArea from "../../../Common/FormInputs/TextArea";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { UserData } from "../../../../Constants/Interfaces/Authentication/UserData";
import { AuthenticationData } from "../../../../Constants/Interfaces/Authentication/AuthenticationData";

const Setting = () => {
  const userData: UserData = useSelector((state: any) => state?.userDataSlice);
  const authenticationData: AuthenticationData = useSelector(
    (state: any) => state?.authenticationDataSlice
  );

  const loginSchema = Yup.object().shape({
    firstName: Yup.string().required("*This Field is required"),
    lastName: Yup.string().required("*This Field is required"),
    emailAddress: Yup.string().required("*This Field is required"),
    walletAddress: Yup.string().required(""),
    gitHub: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?github\.com\/[^\s/]+$/,
      "Please enter a valid GitHub profile URL"
    ),
    telegram: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?t\.me\/[^\s/]+$/,
      "Please enter a valid Telegram profile URL"
    ),
    linkedIn: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/[^\s/]+$/,
      "Please enter a valid LinkedIn profile URL"
    ),
  });   
 
  const formik = useFormik({
    initialValues: {
      emailAddress: userData?.emailAddress,
      walletAddress: authenticationData?.walletAddress,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      gitHub: userData?.gitHub,
      linkedIn: userData?.linkedIn,
      telegram: userData?.telegram,
      bio: userData?.bio,
      profilePicture: userData?.profilePicture,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => { },
  });

  const updateProfile = async (e) => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="Setting">
      <div className="Setting_box">
        <div className="Setting_box_header">
          <div className="Setting_box_header_info">
            <div className="list_image">
              <img src={defaultUserIcon} alt="list-img" />
              <div className="upload_img">
                <img src={upload_img} alt="upload-img" />
              </div>
            </div>
            <div className="list_content">
              <h6 className="user_info_name">
                {userData?.firstName} {userData?.lastName}
              </h6>
              <p className="user_email">{userData?.emailAddress}</p>
            </div>
          </div>
        </div>
        <Form>
          <Form.Group className="Post_request_inputList">
            <Row>
              <Col xl={4}>
                <InputCustom
                  label="First Name"
                  placeholder="Enter your First name"
                  id="firstName"
                  name="firstName"
                  type="text"
                  onChange={formik.handleChange}
                  autoFocus={true}
                  defaultValue={userData?.firstName}
                  value={formik.values.firstName}
                  isInvalid={
                    formik.touched.firstName && formik.errors.firstName
                      ? "is-invalid"
                      : ""
                  }
                  error={
                    formik.errors.firstName && formik.touched.firstName ? (
                      <span className="error-message">
                        {formik.errors.firstName}
                      </span>
                    ) : null
                  }
                ></InputCustom>
              </Col>
              <Col xl={4}>
                <InputCustom
                  label="Last Name"
                  placeholder="Enter your Last name"
                  id="lastName"
                  name="lastName"
                  type="text"
                  onChange={formik.handleChange}
                  autoFocus={true}
                  defaultValue={userData?.lastName}
                  value={
                    formik.values.lastName
                  }
                  isInvalid={
                    formik.touched.lastName && formik.errors.lastName
                      ? "is-invalid"
                      : ""
                  }
                  error={
                    formik.errors.lastName && formik.touched.lastName ? (
                      <span className="error-message">
                        {formik.errors.lastName}
                      </span>
                    ) : null
                  }
                ></InputCustom>
              </Col>
              <Col xl={4}>
                <InputCustom
                  label="Email Address"
                  placeholder="Enter your Email Address"
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  onChange={formik.handleChange}
                  autoFocus={true}
                  readOnly={true}
                  value={formik.values.emailAddress}
                  isInvalid={
                    formik.touched.emailAddress && formik.errors.emailAddress
                      ? "is-invalid"
                      : ""
                  }
                  error={
                    formik.errors.emailAddress &&
                      formik.touched.emailAddress ? (
                      <span className="error-message"></span>
                    ) : null
                  }
                ></InputCustom>
              </Col>
              <Col xl={4}>
                <Form.Label>GitHub</Form.Label>
                <div className="social_account">
                  <div className="social_links">
                    <div className="social_img">
                      <img src={social_img} alt="social-img" />
                    </div>
                    <a href={formik.values.gitHub} target="_blank" rel="noreferrer">
                      Git Hub
                    </a>
                  </div>
                  <InputCustom
                    placeholder="Enter your Github profile"
                    className="github_inp"
                    id="gitHub"
                    name="gitHub"
                    type="text"
                    onChange={formik.handleChange}
                    autoFocus={true}
                    defaultValue={userData?.gitHub}
                    value={
                      formik.values.gitHub
                      
                    }
                    isInvalid={
                      formik.touched.gitHub && formik.errors.gitHub
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.gitHub && formik.touched.gitHub ? (
                        <span className="error-message">
                          {formik.errors.gitHub}
                        </span>
                      ) : null
                    }
                  ></InputCustom>
                </div>
                <span className="error-message">
                  {formik.errors.gitHub}
                </span>

              </Col>
              <Col xl={4}>
                <Form.Label>LinkedIn</Form.Label>
                <div className="social_account">
                  <div className="social_links">
                    <div className="social_img">
                      <img src={social_img2} alt="social-img" />
                    </div>
                    <a
                      href={formik.values.linkedIn}
                      target="_blank"
                      className="linkedin_link"
                      rel="noreferrer"
                    >
                      Linkedin
                    </a>
                  </div>

                  <InputCustom
                    placeholder="Enter your Linkdin Profile"
                    id="linkedIn"
                    className="linked_inp"
                    name="linkedIn"
                    type="text"
                    onChange={formik.handleChange}
                    autoFocus={true}
                    defaultvalue={formik.values.linkedIn}
                    value={
                      formik.values.linkedIn
                      
                    }
                    isInvalid={
                      formik.touched.linkedIn && formik.errors.linkedIn
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.linkedIn && formik.touched.linkedIn ? (
                        <span className="error-message">
                          {formik.errors.linkedIn}
                        </span>
                      ) : null
                    }
                  ></InputCustom>

                </div>
                <span className="error-message">
                  {formik.errors.linkedIn}
                </span>

              </Col>
              <Col xl={4}>
                <Form.Label>Telegram</Form.Label>
                <div className="social_account">
                  <div className="social_links">
                    <div className="social_img">
                      <img src={social_img3} alt="social-img" />
                    </div>
                    <a
                      href={formik.values.telegram}
                      target="_blank"
                      className="telegram_link"
                      rel="noreferrer"
                    >
                      Telegram
                    </a>
                  </div>
                  <InputCustom
                    placeholder="Enter your Telegram Link"
                    id="telegram"
                    className="telegram_inp"
                    name="telegram"
                    type="text"
                    onChange={formik.handleChange}
                    autoFocus={true}
                    defaultvalue={formik.values.telegram}
                    value={
                      formik.values.telegram
                      ? formik.values.telegram
                      : userData?.telegram
                      ? userData?.telegram
                      : ""
                    }
                    isInvalid={
                      formik.touched.telegram && formik.errors.telegram
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.telegram && formik.touched.telegram ? (
                        <span className="error-message">
                          {formik.errors.telegram}
                        </span>
                      ) : null
                    }
                  ></InputCustom>
                </div>
                <span className="error-message">
                  {formik.errors.telegram}
                </span>
              </Col>
              <Col xl={4}>
                <Form.Label>WalletAddress</Form.Label>
                <div className="social_account">
                  <div className="social_links">
                    <div className="social_img">
                      <img src={social_img3} alt="social-img" />
                    </div>
                    <Link to="/" className="telegram_link">
                      WalletAddress
                    </Link>
                  </div>
                  <InputCustom
                    placeholder="Enter your Wallet Address"
                    id="walletAddress"
                    name="walletAddress"
                    type="text"
                    onChange={formik.handleChange}
                    autoFocus={true}
                    defaultvalue={formik.values.walletAddress}
                    value={
                      formik.values.walletAddress
                    }
                    isInvalid={
                      formik.touched.walletAddress &&
                        formik.errors.walletAddress
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.walletAddress &&
                        formik.touched.walletAddress ? (
                        <span className="error-message">
                          {formik.errors.walletAddress}
                        </span>
                      ) : null
                    }
                  ></InputCustom>
                </div>
              </Col>
              <Row className="p-0 m-0">
                <Col xl={4}>

                  <TextArea
                    placeholder="Enter About yourself"
                    label="Profile Bio"
                    id="bio"
                    name="bio"
                    type="text"
                    onChange={formik.handleChange}
                    autoFocus={true}
                    defaultvalue={formik.values.bio}
                    value={
                      formik.values.bio
                    }
                    isInvalid={
                      formik.touched.bio && formik.errors.bio
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.bio && formik.touched.bio ? (
                        <span className="error-message">
                          {formik.errors.bio}
                        </span>
                      ) : null
                    }
                  ></TextArea>
                </Col>
              </Row>
              <Col xl={12}>
                <ButtonCustom
                  title="Update"
                  type="submit"
                  onClick={(e) => updateProfile(e)}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default Setting;
