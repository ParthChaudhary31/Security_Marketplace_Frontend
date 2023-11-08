import React from "react";
import { NavLink } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import "./Dropdowns.scss";

const CommonDropdown = ({ className, icon, title, options }) => {

  return (
    <>
      <div className={`common_dropdown ${className}`}>
        <Dropdown>
          <Dropdown.Toggle>
            <span className="common_dropdown_icon">{icon}</span>
            <span className="common_dropdown_title">{title}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu renderOnMount={true}>
              {options.map((item:any, index:any) => (
              <NavLink className="dropdown-item" href={item?.to} key={index}>{item?.menu}</NavLink>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default CommonDropdown;
