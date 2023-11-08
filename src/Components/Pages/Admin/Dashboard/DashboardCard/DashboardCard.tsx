import "./DashboardCard.scss";
import ButtonCustom from "../../../../Common/Button/ButtonCustom";
import { Link } from "react-router-dom";
import defaultUserIcon from "../../../../../Assets/Images/defaultUserIcon.png";
import { AUDITOR, COMPLETED, FAILED, IN_PROGRESS, PATRON, SUBMITTED, UNDER_ARBITERATION, baseUrl, isImageFile } from "../../../../../Constant";
import ExtendRequestModal from "../../../../Common/CommonModal/ExtendRequestModal/ExtendRequestModal";
import {  useState } from "react";
import SubmitRequestModal from "../../../../Common/SubmitRequestModal/SubmitRequestModal";

const DashboardCard = ({
  id,
  name,
  surName,
  to,
  email,
  icon,
  date,
  auditType,
  extendedTime,
  gitUrl,
  offerAmount,
  estimatedDelivery,
  userType,
  extendbtn,
  status,
  userPosts,
}) => {
  const data = [
    {
      head: "GitHub",
      text: gitUrl,
    },
    {
      head: "Offered Amount",
      text: offerAmount,
    },
    {
      head: "Expected Timeline",
      text: estimatedDelivery,
    },
  ];
  const profilePictureUrl = baseUrl + (icon && isImageFile(icon) ? icon : "");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showNew, setShowNew] = useState(false);
  const handleCloseNew = () => setShowNew(false);
  const handleShowNew = () => setShowNew(true);
  return (
    <div className="dashboard_card">
      <Link to={to} state={{ postID: id }}>
        {userType === PATRON && status === SUBMITTED ? (
          <ButtonCustom className="dashboard_card_btn" title="View Post" />
        ) :userType === PATRON && status === FAILED ? (
          <ButtonCustom className="dashboard_card_btn" title="failed" disabled={true} />
        ) :
         userType === PATRON && status === COMPLETED ? (
          <ButtonCustom
            className="dashboard_card_btn"
            title="Completed"
            disabled={true}
          />
        ) : userType === PATRON && status === UNDER_ARBITERATION? (
          <ButtonCustom
            className="dashboard_card_btn"
            title="Under Arbiteration"
            disabled={true}
          />
        ) : userType === AUDITOR && status === UNDER_ARBITERATION? (
          <ButtonCustom
            className="dashboard_card_btn"
            title="Under Arbiteration"
            disabled={true}
          />
        ) : userType === AUDITOR && status === COMPLETED ? (
          <ButtonCustom
            className="dashboard_card_btn"
            title="Completed"
            disabled={true}
          />
        ) : userType === AUDITOR && status === SUBMITTED ? (
          <ButtonCustom
            className="dashboard_card_btn"
            title="Submitted"
            disabled={true}
          />
        ): userType === AUDITOR && status === FAILED ? (
          <ButtonCustom
            className="dashboard_card_btn"
            title="failed"
            disabled={true}
          />
        ) : (
          <ButtonCustom className="dashboard_card_btn" title="View Request" />
        )}
      </Link>
      {userType === PATRON || userType === AUDITOR ? (
        <>
          <ButtonCustom className="dashboard_card_user" title={userType} />
          {userType === AUDITOR && status === IN_PROGRESS? (
            <>
              <ButtonCustom
                className="dashboard_card_new"
                title="Submit Audit"
                onClick={handleShowNew}
              />
              <ButtonCustom
                onClick={handleShow}
                className="extend_timeline"
                title="Extend Timeline"
                disabled={userPosts?.extensionRequest ? true : false}
              >
                {extendbtn}
              </ButtonCustom>
            </>
          ) : null}
        </>
      ) : (
        ""
      )}

      <div className="dashboard_card_inner_body">
        <h6>Posted On: {date}</h6>
      </div>
      <div className="dashboard_card_inner">
        <div className="dashboard_card_inner_header">
          <span className="token_icon">
            <img
              src={
                icon && isImageFile(profilePictureUrl)
                  ? profilePictureUrl
                  : icon === ""
                  ? defaultUserIcon
                  : ""
              }
              alt="user_img"
            />
          </span>
          <div className="user_id">
            <p>Uid: {id}</p>
            <h4>{name + " " + surName}</h4>
            <p>{email}</p>
          </div>
        </div>
      </div>
      <div className="dashboard_card_audit">
        <h6>Audit Types: </h6>
        {auditType[0] ? (
          <div className="dashboard_card_audit_card">
            <p>{auditType[0]}</p>
          </div>
        ) : (
          ""
        )}
        {auditType[1] ? (
          <div className="dashboard_card_audit_card">
            <p>{auditType[1]}</p>
          </div>
        ) : (
          ""
        )}
        {auditType[2] ? (
          <div className="dashboard_card_audit_card">
            <p>{auditType[2]}</p>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="dashboard_card_footer">
        {data?.map((item: any, key: any) => (
          <div key={key} className="dashboard_card_footer_inner">
            <h4>{item?.head}</h4>
            <p>
              {item?.head === "Offered Amount"
                ? item?.text + " USD"
                : item?.text}
            </p>
          </div>
        ))}
      </div>
      <SubmitRequestModal
        show={showNew}
        onHide={handleCloseNew}
        auditId={id}
        offerAmount={offerAmount}
        auditType={auditType}
      />
      <ExtendRequestModal
        show={show}
        onHide={handleClose}
        extendedTime={extendedTime}
        userPosts={userPosts}
      />
    </div>
  );
};

export default DashboardCard;
