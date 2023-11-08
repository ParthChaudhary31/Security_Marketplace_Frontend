import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import logo from "../../../Assets/Images/logo.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import ButtonCustom from "../Button/ButtonCustom";
import SocialLinks from "../SocialLinks/SocialLinks";
import "./Footer.scss";

const quickLinks = [
  {
    name: "About Us",
    to: "about_sec",
  },
  {
    name: "Tokenomics",
    to: "token_sec",
  },
  {
    name: "Roadmap",
    to: "roadmap_sec",
  },
  {
    name: "Team",
    to: "team_sec",
  },
  {
    name: "FAQ’s",
    to: "faq_sec",
  },
];

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} sm={6}>
            <div className="footer__left">
              <span className="footer__logo">
                <img src={logo} alt="footer-logo" />
              </span>
              <p>
                Don’t hesitate to subscribe to latest news about ICO markets as
                well as crucial financial knowledge to become successful
                investors globally
              </p>
              <SocialLinks />
            </div>
          </Col>
          <Col md={4} sm={6}>
            <Row>
              <Col sm={6}>
                <h5>Quick Links</h5>
                <ul className="footer__links">
                  {quickLinks.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          to={item.to}
                          key={index}
                          spy={true}
                          offset={-70}
                          duration={500}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Col>
              <Col sm={6} className="mt-3 mt-sm-0">
                <h5>Download</h5>
                <ul className="footer__links">
                  <li>
                    <Link to="/">Whitepaper</Link>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
          <Col md={4} className="mt-3 mt-md-0">
            <div className="footer__right">
              <h5>Don't miss out, Stay updated</h5>
              <p>Don’t hesitate to subscribe to latest news about ICO</p>
              <div className="footer__subscribe">
                <input placeholder="Enter your email" type="email" />
                <ButtonCustom title="SUBSCRIBE" />
              </div>
              <ButtonCustom
                title="contact us"
                onClick={() => navigate("/contact-us")}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <div className="text-center footer__copyright">
        <span>
          © Copyright {new Date().getFullYear()}. All Rights Reserved by Audit Bazaar
        </span>
      </div>
    </footer>
  );
};

export default Footer;
