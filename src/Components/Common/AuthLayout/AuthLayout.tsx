import { useEffect, useState } from "react";
import { IdleTimerProvider } from "react-idle-timer";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../Sidebar/Sidebar";
import sm_logo from "../../../Assets/Images/logo.svg";
import wallet from "../../../Assets/Images/wallet.svg";
import "./AuthLayout.scss";
import defaultUserIcon from "../../../Assets/Images/defaultUserIcon.png";
import { Dropdown } from "react-bootstrap";
import ConnectWallet from "../ConnectWallet/subWallet";
import { handleLogout } from "../../../Services/Helpers/stateManagement";
import { baseUrl, isImageFile } from "../../../Constant";
import store from "../../../Redux/store";
import {
  setUserActiveTab,
  setUserDashboardTab,
  setUserProfileNumber,
} from "../../../Redux/userData/userData";

const AuthLayout = ({ heading }) => {
  const navigate = useNavigate();

  const userData = useSelector((state: any) => state?.userDataSlice);

  const profilePictureUrl =
    baseUrl +
    (userData?.profilePicture && isImageFile(userData.profilePicture)
      ? userData.profilePicture
      : "");

  const [active, setActive] = useState(false);
  useEffect(() => {
    window.onresize = function () {
      if (document.body.clientWidth > 1199) {
        setActive(true);
      }
    };
    setActive(true);
  }, []);
  const handleSidebar = () => {
    store.dispatch(setUserDashboardTab(""));
    store.dispatch(setUserProfileNumber(""));
    store.dispatch(setUserActiveTab({ type: "", eventNumber: "first" }));
    setActive(!active);
  };
  const onIdle = () => {
    Swal.fire({
      icon: "info",
      title: "Session Expired",
      text: "Your session is expired, You have to login again to continue",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then(() => {
      handleLogout(navigate, userData);
    });
  };
  const location = useLocation();

  const navigateToProfile = () => {
    navigate("/admin/my-profile");
  };

  let alterPaths = [
    {
      path: "/admin/dashboard-listing",
      alterPath: "Dashboard",
    },
    {
      path: "/admin/my-profilepage",
      alterPath: "My Profile",
    },
    {
      path: "/admin/pending-audits",
      alterPath: "My Profile",
    },
  ];

  return (
    <IdleTimerProvider timeout={1000 * 60 * 15} crossTab={true} onIdle={onIdle}>
      <div className={`auth_layout ${active ? "expanded_sidebar" : ""}`}>
        <div className="no_internet_connection"></div>

        <Sidebar handleSidebar={handleSidebar} />
        <div className="auth_layout_inner">
          <header className="auth_layout_inner_header">
            {!active && (
              <div
                onClick={handleSidebar}
                className={`${
                  active ? "active" : ""
                } sidebar_backdrop d-xl-none`}
              />
            )}
            <div className="auth_layout_inner_header_logo">
              <img src={sm_logo} alt="logo" className="desk_log" />
            </div>
            <h4
              className={`text-dark ms-4 mt-3 ${
                location.pathname.includes("/admin/2fa")
                  ? "text-uppercase"
                  : "text-capitalize"
              }`}
            >
              {alterPaths.filter((item) => item?.path === location.pathname)
                .length > 0
                ? alterPaths.filter(
                    (item) => item?.path === location.pathname
                  )[0].alterPath
                : location.pathname
                    .split("/")
                    [location.pathname.split("/").length - 1].split("-")
                    .join(" ")}
            </h4>
            <h2>{heading}</h2>
            <ConnectWallet wallet-icon={wallet} />
            <div className="auth_layout_inner_user">
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <img
                    src={
                      profilePictureUrl && isImageFile(profilePictureUrl)
                        ? profilePictureUrl
                        : defaultUserIcon
                    }
                    alt="user_img"
                  />
                  <span>
                    {userData?.firstName} {userData?.lastName}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={navigateToProfile}>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleLogout(navigate, userData)}
                  >
                    Logout
                  </Dropdown.Item>
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
