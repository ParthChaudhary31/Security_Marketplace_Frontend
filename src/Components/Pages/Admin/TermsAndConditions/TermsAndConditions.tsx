import { Container, Row } from "react-bootstrap";
import "./TermsAndCondition.scss";
import CommonHeader from "../../../Common/CommonHeader/CommonHeader";

const TermsAndConditions = () => {
  return (
    <div className="content_handle">
      <CommonHeader />
      <Container>
        <Row>
          <h2>Terms and Conditions</h2>
          
          <div className="content_handle_body">
            Terms and Conditions: Introduction: Welcome to Audit Bazaar. These
            terms and conditions outline the rules and regulations for the use
            of our website and services. 1. Acceptance of Terms: By accessing
            and using our website and services, you agree to be bound by these
            terms and conditions. If you do not agree to these terms, please do
            not use our website and services. 2. Changes to the Terms: We
            reserve the right to update and modify these terms from time to
            time. Any changes will be effective immediately upon posting on this
            page. Your continued use of the website after any modifications will
            constitute your acceptance of the revised terms. 3. Intellectual
            Property: All content, designs, logos, trademarks, and other
            intellectual property on our website are owned by us or licensed to
            us. You may not use, copy, reproduce, modify, distribute, or display
            any of our intellectual property without prior written consent. 4.
            User Conduct: When using our website, you agree not to: Violate any
            applicable laws or regulations. Infringe upon any third-party
            rights. Attempt to gain unauthorized access to our systems. Engage
            in any conduct that could harm the website or other users.
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
