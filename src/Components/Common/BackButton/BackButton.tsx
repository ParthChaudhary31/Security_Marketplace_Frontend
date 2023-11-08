import React from "react";
import "./BackButton.scss";
import back_arrow from "../../../Assets/Images/Icons/back-arrow.svg";
import { useNavigate } from "react-router-dom";

const BackButton = (props) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    if(props?.page === "listing"){
      navigate("/admin/dashboard"); 
    }
    else if(props?.page === "profile"){
      navigate("/admin/my-profile");
    }
  };

  return (
    <div className="backIcon" onClick={handleBackClick}>
      <span>
        <img src={back_arrow} alt="back-arrow" />
      </span>
      <p>Back</p>
    </div>
    // </Link>
  );
};

export default BackButton;
