import { Link, NavLink, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  SettingsIcon,
  AuditIcon,
  BalanceIcon,
  VotingIcon,
  ProfileIcon,
  TfaIcon,
} from "../../../Assets/Images/Icons/SvgIcons";
import logo from "../../../Assets/Images/logo.svg";
import "./Sidebar.scss";

const Sidebar = ({handleSidebar}:{handleSidebar?:()=>void}) => {
  const NavLinks = [
    {
      icon: <DashboardIcon />,
      label: "Dashboard",
      to: "/admin/dashboard",
      
      activePaths: [
        {
          id: 1,
          path: "/admin/dashboard-listing",
        },
      ],
    },
    {
      icon: <AuditIcon />,
      label: "Audit Request",
      to: "/admin/audit-request",
    },
    {
      icon: <ProfileIcon />,
      label: "My Profile",
      to: "/admin/my-profile",
      activePaths: [
        {
          id: 1,
          path: "/admin/my-profilepage",
        },
      ],
    },
    {
      icon: <BalanceIcon />,
      label: "Balance",
      to: "/admin/balance",
    },

    {
      icon: <SettingsIcon />,
      label: "Settings",
      to: "/admin/settings",
    },
    {
      icon: <VotingIcon />,
      label: "Voting",
      to: "/admin/voting",
    },
    {
      icon: <TfaIcon />,
      label: "2FA",
      to: "/admin/2fa",
    },
  ];

  const location = useLocation();

  return (
    <aside className="sidebar">
      <ul className="sidebar_inner">
        <div className="sidebar_inner_header">
          <Link to="/admin/dashboard">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        {NavLinks?.map((item,index:any) => (
          <li key={index}>
            <NavLink
              to={item?.to}
              className={`nav_link ${item?.activePaths?.filter(
                (item) => location?.pathname === item?.path
              ).length
                ? "active"
                : ""
                }`}
                onClick={handleSidebar}
            >
              <span className="nav_link_icon">{item?.icon}</span>
              {item?.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
