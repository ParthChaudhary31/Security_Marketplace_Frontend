import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "../../../Assets/Images/logo.svg";
import ConnectWallet from "../ConnectWallet/subWallet";
import { Link } from "react-scroll";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Shimmer from "../Shimmer/Shimmer";
import LoadingBar from "react-top-loading-bar";
import "./index.scss";

const headerNavLink = [
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

const Header = ({
  afterLogin,
  handleSidebar,
  active,
}: {
  afterLogin?: boolean;
  active?: boolean;
  handleSidebar?: () => void;
}) => {
  const walletAddress = useSelector((state: any) => state?.user?.walletAddress);

  const [progress, setProgress] = useState(0);

  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 100);
    });
  }, []);

  return (
    <>
      {active && (
        <div
          onClick={handleSidebar}
          className={`${active ? "active" : ""} sidebar_backdrop d-lg-none`}
        />
      )}

      <header
        className={`header   
     ${scroll && "scrolled"}`}
      >
        <LoadingBar
          color="#7CD0DE"
          progress={progress}
          height={4}
          onLoaderFinished={() => setProgress(0)}
        />
        <Navbar className="app-header" expand="lg">
          <Container>
            <NavLink to="/" className="header-logo">
              <img src={logo} alt="logo" />
            </NavLink>

            <Navbar.Offcanvas placement="end" className="header__offcanvas">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                  <NavLink to="/" className="header__logo">
                    <img src={logo} alt="logo" />
                  </NavLink>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="align-items-lg-center justify-content-end flex-grow-1">
                  {headerNavLink.map((data, index) => {
                    return (
                      <Link
                        to={data.to}
                        className="nav-link"
                        key={index}
                        spy={true}
                        offset={-70}
                        duration={500}
                      >
                        {data.name}
                      </Link>
                    );
                  })}
                  {walletAddress && (
                    <NavLink to="/auth/transaction-detail" className="nav-link">
                      Transactions Details
                    </NavLink>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
            <div className="d-flex align-items-center">
              {false ? <Shimmer height={38} /> : <ConnectWallet />}
              <Navbar.Toggle />
            </div>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
