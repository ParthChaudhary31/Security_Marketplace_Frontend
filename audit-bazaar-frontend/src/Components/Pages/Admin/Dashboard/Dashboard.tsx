import { Col, Container, Row } from "react-bootstrap";
import DashboardCard from "./DashboardCard/DashboardCard";
import user from "../../../../Assets/Images/user_img.png";
import "./Dashboard.scss";
import CustomPagination from "../../../Common/CustomPagination/CustomPagination";

const Dashboard = () => {

  const Carddata = [
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
  ];
  

  return (
    <section className="user_details">
      <Container fluid>
        <Row className="mt-5">
          {Carddata.map((item) => (
            <Col xl={4} lg={4} md={6} sm={6} key={item.id}>
              <DashboardCard
                id={item.id}
                name={item.name}
                icon={item.icon}
                date={item.date}
                email={item.email}
                auditType={""}
                gitUrl={""}
                offerAmount={""}
                estimatedDelivery={""}
                to={"/admin/dashboard-listing"}
              />
            </Col>
          ))}
          <CustomPagination className="dashboard_pagination" />
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
