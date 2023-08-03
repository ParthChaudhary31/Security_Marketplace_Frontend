import { useState } from "react";
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
import DatePicker from "../../../Common/FormInputs/DatePicker/DatePicker";
import { useNavigate } from "react-router-dom";

const Post = () => {
  const navigate = useNavigate();
  const [checkedType, setCheckedType] = useState<any>([]);

  const userData: UserData = useSelector((state: any) => state?.userDataSlice);

  const options = [
    {
      value: "Smart Contract Audit",
      label: (
        <>
          <input
            type="checkbox"
            checked={checkedType.includes("Smart Contract Audit")}
            className="post_checkbox"
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
          />
          Performance Testing
        </>
      ),
    },
  ];

  const auditSchema = Yup.object().shape({
    // emailAddress: Yup.string().required("*This Field is required"),
    gitHub: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?github\.com\/[^\s/]+$/,
      "Please enter a valid GitHub profile URL"
    ),
    offerAmount: Yup.number()
      .typeError("Offer Amount must be a number")
      .required("*This Field is required")
      .min(0, "Offer Amount cannot be negative"),
    socialLink: Yup.string()
      .required("*This Field is required")
      .matches(
        /^(https?:\/\/)?(www\.)?(facebook|google|telegram|linkedin|discord)\.\w{2,3}(\/\S*)?$/,
        "Invalid social link"
      ),
    estimatedDelivery: Yup.string().required("*This Field is required"),
    description: Yup.string().required("*This Field is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: userData?.name,
      emailAddress: userData?.emailAddress,
      gitHub: userData?.gitHub,
      auditType: "",
      offerAmount: "",
      estimatedDelivery: "",
      description: "",
      socialLink: "",
      text: "",
      url: "",
    },
    validationSchema: auditSchema,
    onSubmit: (values) => { },
  });

  return (
    <section className="Post">
      <div className="Post_request">
        <h6>Fill in the Details</h6>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="Post_request_inputList">
            <Row>
              <Col sm={6}>
                <InputCustom
                  type="text"
                  label="Full Name"
                  id="name"
                  InputName="post_input"
                  placeholder="Enter Full Name"
                  onChange={formik.handleChange}
                  autoFocus={true}
                  value={formik.values.name}
                  isInvalid={
                    formik.touched.name && !!formik.errors.name
                  }
                  error={
                    formik.errors.text && formik.touched.text ? (
                      <span className="error-message">
                        {formik.errors.text}
                      </span>
                    ) : null
                  }
                ></InputCustom>
              </Col>
              <Col sm={6}>
                <InputCustom
                  type="emailAddress"
                  label="Email"
                  id="emailAddress"
                  InputName="post_input"
                  placeholder="Enter Email Address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoFocus={true}
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
                <Form.Label>Audit Types</Form.Label>
                <Select
                  options={options}
                  defaultValue={options[""]}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isMulti
                  className="select_option"
                  onChange={(options: any) => {
                    if (Array.isArray(options)) {
                      setCheckedType(
                        options.map((opt: any) => opt.value.toString())
                      );
                    }
                  }}
                />
              </Col>
              <Col sm={6}>
                <InputCustom
                  type="socialLink"
                  label="Social-Link"
                  InputName="socialLink"
                  id="socialLink"
                  placeholder="socialLink"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoFocus={true}
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
                  label="Git Hub URL"
                  id="gitHub"
                  InputName="post_input"
                  placeholder="Enter Github Link"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoFocus={true}
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
                  label="Offered Amount"
                  InputName="offerAmount"
                  id="offerAmount"
                  placeholder="Enter OfferAmount"
                  onChange={(e) => {
                    e.preventDefault();
                    const { value } = e.target;
                    const regex = /^(\d+)?([.]?\d{0,6})?$/;
                    if (regex.test(value.toString())) {
                      formik.handleChange(e)
                    }
                  }}
                  onBlur={formik.handleBlur}
                  autoFocus={true}
                  value={formik.values.offerAmount}
                  isInvalid={formik.touched.text && !!formik.errors.offerAmount}
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
                <DatePicker
                  type="estimatedDelivery"
                  label="Estimated Delivery"
                  inputName="estimatedDelivery"
                  id="estimatedDelivery"
                  Dateclass="post_input"
                  placeholder="Enter EstimatedDelivery"
                  onChange={formik.handleChange}
                  autoFocus={true}
                  value={formik.values.estimatedDelivery}
                  isInvalid={
                    formik.touched.text && !!formik.errors.estimatedDelivery
                  }
                  error={
                    formik.errors.estimatedDelivery &&
                      formik.touched.estimatedDelivery ? (
                      <span className="error-message">
                        {formik.errors.estimatedDelivery}
                      </span>
                    ) : null
                  }
                ></DatePicker>
              </Col>

              <Col xl={12}>
                <TextArea
                  type="description"
                  label=" Description"
                  inputName="description"
                  id="description"
                  placeholder="Describe About the project and It's Requirment"
                  onChange={formik.handleChange}
                  autoFocus={true}
                  value={formik.values.description}
                  isInvalid={formik.errors.description}
                  error={
                    formik.errors.url && formik.touched.url ? (
                      <span className="error-message">
                        {formik.errors.description}
                      </span>
                    ) : null
                  }
                ></TextArea>
              </Col>
              <Col xl={12}>
                <ButtonCustom
                  title="Confirm"
                  type="submit"
                  fluid
                  className="post_btn"
                  onClick={()=>navigate("/admin/MyProfile")}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default Post;
