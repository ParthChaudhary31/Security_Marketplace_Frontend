import React from "react";
import "./CommonHeader.scss";
import logo from "../../../Assets/Images/logo.svg";

const CommonHeader = () => {
  return (
    <>
      
      <div className="common_header">
        <img src={logo} alt="" />
      </div>
    </>
  );
};

export default CommonHeader;
