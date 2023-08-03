import { Link, NavLink } from "react-router-dom";
import {
  DashboardIcon,
  SettingsIcon,
  AuditIcon,
  BalanceIcon,
  VotingIcon,
} from "../../../Assets/Images/Icons/SvgIcons";
import logo from "../../../Assets/Images/logo.svg";
import "./Sidebar.scss";

const Sidebar = ({ handleSidebar }: { handleSidebar?: () => void }) => {
  const NavLinks = [
    {
      icon: <DashboardIcon />,
      label: "Dashboard",
      to: "/admin/dashboard",
    },
    {
      icon: <AuditIcon />,
      label: "Audit Request",
      to: "/admin/audit-request",
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
  ];

  return (
    <aside className="sidebar">
      <ul className="sidebar_inner">
        <div className="sidebar_inner_header">
          <Link to="/admin/dashboard">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        {NavLinks.map((item) => (
          <li key={item.label}>
            <NavLink to={item.to} className="nav_link" onClick={handleSidebar}>
              <span className="nav_link_icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
