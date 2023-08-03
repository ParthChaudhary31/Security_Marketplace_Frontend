import { useEffect } from "react";
import { Container, Row, Tab, Tabs, Col } from "react-bootstrap";
import DashboardCard from "../Dashboard/DashboardCard/DashboardCard";
import "./MyProfile.scss";
import user from "../../../../Assets/Images/user_img.png";
import user2 from "../../../../Assets/Images/profile-img.svg";
import ProfileBio from "../../../Common/ProfileBio/ProfileBio";

const MyProfile = () => {
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
      icon: user2,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
  ];

  const Carddata2 = [
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
      icon: user2,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user2,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user2,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
  ];

  const Carddata3 = [
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
      icon: user2,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
    {
      id: 27384,
      name: "Bradley Cooper",
      icon: user2,
      date: "13-06-2023",
      email: "brad119@gmail.com",
    },
  ];

  // GET AUDIT REQUEST POST
  const auditDetailsPost = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    auditDetailsPost();
  }, []);

  return (
    <>
      <section className="profile_sec">
        <Container fluid>
          <Row>
            <Col>
              <Tabs
                defaultActiveKey="post"
                id="uncontrolled-tab-example"
                className="voting_tab"
              >
                <Tab eventKey="post" title="Posts">
                  <Row>
                    <Col xl={8} lg={12} md={12} sm={12}>
                      <Row>
                        {Carddata.map((item) => (
                          <Col xl={6} md={6} sm={12} key={item.id}>
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
                              to="/admin/my-profilepage"
                            />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                    <Col xl={4} md={6} sm={12}>
                      <ProfileBio />
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="Completed Audits" title="Completed Audits">
                  <Row>
                    <Col xl={8} lg={12} md={12} sm={12}>
                      <Row>
                        {Carddata2.map((item) => (
                          <Col xl={6} md={6} sm={12} key={item.id}>
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
                              to="/admin/my-profilepage"
                            />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                    <Col xl={4} md={6} sm={6}>
                      <ProfileBio />
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="Pending Audits" title="Pending Audits">
                  <Row>
                    <Col xl={8} lg={12} md={12} sm={12}>
                      <Row>
                        {Carddata3.map((item) => (
                          <Col xl={6} md={6} sm={12} key={item.id}>
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
                              to="/admin/my-profilepage"
                            />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                    <Col xl={4} lg={6} md={6} sm={12}>
                      <ProfileBio />
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default MyProfile;
