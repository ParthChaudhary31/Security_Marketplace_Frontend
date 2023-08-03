import "./DashboardCard.scss";
import ButtonCustom from "../../../../Common/Button/ButtonCustom";
import { Link } from "react-router-dom";
import defaultUserIcon from "../../../../../Assets/Images/defaultUserIcon.png";

const DashboardCard = ({ id, name, email, icon, date, auditType, gitUrl, offerAmount, estimatedDelivery, to }) => {

  const data = [
    {
      head: "Gitlab URL",
      text: "www.github.com",
    },
    {
      head: "Offered Amount",
      text: "1000$",
    },
    {
      head: "Expected Timeline",
      text: "15/8/2023",
    },
  ]

  const auditType1 = ["Smart Contract Audit", "Penetration testing", " Performance testing"]
  return (
    <div className="dashboard_card">
      <Link to={to}><ButtonCustom className="dashboard_card_btn" title="View Request" ></ButtonCustom></Link>
      <div className="dashboard_card_inner">
        <div className="dashboard_card_inner_header">
          <span className="token_icon">
            <img src={defaultUserIcon} alt="" />
          </span>
          <div className="user_id">
            <p>U ID: {id}</p>
            <h4>{name}</h4>
            <p>{email}</p>
          </div>
        </div>
        <div className="dashboard_card_inner_body">
          <h6>Posted On: {date}</h6>
        </div>
      </div>
      <div className="dashboard_card_audit">
        <h6>Audit Types: </h6>
        {auditType1[0] ? <div className="dashboard_card_audit_card">
          <p>{auditType1[0]}</p>
        </div> : ""}
        {auditType1[1] ? <div className="dashboard_card_audit_card">
          <p>{auditType1[1]}</p>
        </div> : ""}
        {auditType1[2] ? <div className="dashboard_card_audit_card">
          <p>{auditType1[2]}</p>
        </div> : ""}
      </div>
      <div className="dashboard_card_footer">
        {data.map((item) => (
          <div className="dashboard_card_footer_inner" >
            <h4>{item.head}</h4>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCard;
