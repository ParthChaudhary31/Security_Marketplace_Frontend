import { Col, Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
import TextArea from "../../Common/FormInputs/TextArea";
import InputCustom from "../../Common/Inputs/InputCustom";
import "./ContactUs.scss";
import ButtonCustom from "../../Common/Button/ButtonCustom";

const ContactUs = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    onSubmit: (values) => {},
  });
  return (
    <section className="contact-page inner-page">
      <Container>
        <div className="contact-page__wrap">
          <h4>Contact Us</h4>
          <form onSubmit={formik.handleSubmit}>
            <Row>
              <Col xs={12}>
                <InputCustom
                  id="name"
                  name="name"
                  placeholder="Enter Your Name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </Col>
              <Col xs={12}>
                <InputCustom
                  id="email"
                  name="email"
                  placeholder="Enter Your Email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </Col>
              <Col xs={12}>
                <InputCustom
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  onChange={formik.handleChange}
                  value={formik.values.subject}
                />
              </Col>
              <Col xs={12}>
                <TextArea
                  onChange={formik.handleChange}
                  name="message"
                  value={formik.values.message}
                  placeholder="Enter Your Message"
                />
              </Col>
              <Col xs={12}>
                <ButtonCustom type="submit" title="Submit" />
              </Col>
            </Row>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default ContactUs;
