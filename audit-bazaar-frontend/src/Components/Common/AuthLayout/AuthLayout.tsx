import { useEffect, useState } from "react";
import { IdleTimerProvider } from "react-idle-timer";
import { useSelector } from "react-redux";
import {  Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../Sidebar/Sidebar";
import sm_logo from "../../../Assets/Images/logo.svg";
import wallet from "../../../Assets/Images/wallet.svg";
import "./AuthLayout.scss";
import defaultUserIcon from "../../../Assets/Images/defaultUserIcon.png"
import { Dropdown } from "react-bootstrap";
import ConnectWallet from "../ConnectWallet/subWallet";

const AuthLayout = ({ heading }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);
  const userData = useSelector((state: any) => state?.userDataSlice);

  const handleSidebar = () => setActive(!active);
  const location = useLocation();

  useEffect(() => {
    window.onresize = function () {
      if (document.body.clientWidth > 1199) {
        setActive(true);
      }
    }
    setActive(true);
  }, [])

  //SESSION EXPIRED
  const onIdle = () => {
    localStorage.clear();
    Swal.fire({
      icon: "info",
      title: "Session Expired",
      text: "Your session is expired, You have to login again to continue",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then(() => { });
  };

  //Fn LOGOUT
  const logout = async () => {
    navigate("/");
  }

  //Fn NAVIGATE_PROFILE
  const navigateToProfile = () => {
    localStorage.clear()
    navigate("/admin/MyProfile");
  }

  return (
    <IdleTimerProvider timeout={1000 * 60 * 15} crossTab={true} onIdle={onIdle}>
      <div className={`auth_layout ${active ? "expanded_sidebar" : ""}`}>
        <Sidebar handleSidebar={handleSidebar} />
        <div className="auth_layout_inner">
          <header className="auth_layout_inner_header">
            {!active && (
              <div
                onClick={handleSidebar}
                className={`${active ? "active" : ""
                  } sidebar_backdrop d-xl-none`}
              />
            )}
            <div className="auth_layout_inner_header_logo">
              <img src={sm_logo} alt="logo" className="desk_log" />
            </div>
            {/* <h4 className="text-dark ms-4 mt-3">{`${store[store.length - 1][0].toUpperCase() + store[store.length - 1].slice(1)}${store[2] == "post" ? "s" : ""}`}</h4> */}
            <h4 className="text-dark ms-4 mt-3 text-capitalize">{location.pathname.split("/")[location.pathname.split("/").length - 1].split("-").join(" ")}</h4>
            <h2>{heading}</h2>
            <ConnectWallet wallet-icon={wallet} />
            <div className="auth_layout_inner_user">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <img src={defaultUserIcon} alt="user_img" />
                  <span>
                    {userData?.firstName} {userData?.lastName}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={navigateToProfile}>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <button
              className={`toggle_btn ${!active ? "active" : ""}`}
              onClick={handleSidebar}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </header>
          <Outlet />
        </div>
      </div>
    </IdleTimerProvider>
  );
};

export default AuthLayout;
