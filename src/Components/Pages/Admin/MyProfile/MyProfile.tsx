import { useEffect, useState } from "react";
import { Container, Nav, Row, Tab, Col, Form } from "react-bootstrap";
import DashboardCard from "../Dashboard/DashboardCard/DashboardCard";
import "./MyProfile.scss";
import ProfileBio from "../../../Common/ProfileBio/ProfileBio";
import { getAllAuditDetails } from "../../../../Api/Actions/user.action";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import CustomPagination from "../../../Common/CustomPagination/CustomPagination";
import {
  ALL,
  AUDIT_POST_STATUS_TYPES,
  INPROGRESS,
  PENDING,
  SUBMITTED,
  COMPLETED,
} from "../../../../Constants/AuditPost/AuditPostTypes";
import { FilterIcon } from "../../../../Assets/Images/Icons/SvgIcons";
import { setUserProfileNumber } from "../../../../Redux/userData/userData";

import { setUserActiveTab } from "../../../../Redux/userData/userData";
import Dropdown from "react-multilevel-dropdown";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import { useNavigate } from "react-router-dom";
import NoPostFound from "../../../Common/NoDataFound/NoPostFound";

let limit: number = 10;

const MyProfile = () => {
  const dispatch: any = useDispatch();
  const activePage = useSelector(
    (state: any) => state?.userDataSlice?.userProfileNumber
  );
  const [userPosts, setUserPosts] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(activePage || 0);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState<number>(0);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [amountFilter, setAmountFilter] = useState<any>("");
  const [auditTypeFilters, setAuditTypeFilters] = useState<any>({
    PerformanceTesting: false,
    PenetrationTesting: false,
    SmartContractAudit: false,
  });

  const handlePageChange = (selected: any) => {
    setCurrentPage(selected.selected);
    dispatch(setUserProfileNumber(selected.selected));
    setShouldScrollToTop(true);
  };

  const userEmail = useSelector(
    (state: any) => state?.userDataSlice.emailAddress
  );
  const active = useSelector(
    (state: any) => state?.userDataSlice.userActiveTab
  );
  const submitAudit = useSelector(
    (state: any) => state?.AuditReport?.submitAuditSuccess
  );
  const statusForExtended: any = useSelector(
    (state: any) => state?.userDataSlice?.statusExtendedForAuditor
  );
  const extendForPatron = useSelector(
    (state: any) =>
      state?.authenticationDataSlice?.transactionHashForExtendedForPatron
  );

  const navigate = useNavigate();

  const filterByAmountRange = (range: any) => {
    setCurrentPage(0);
    setAmountFilter(range);
    const filteredData = userPosts.filter((item: any) => {
      const offerAmount = item?.offerAmount;
      if (range === "0-11") {
        return offerAmount >= 0 && offerAmount <= 11;
      } else if (range === "11-51") {
        return offerAmount >= 11 && offerAmount <= 51;
      } else if (range === "51") {
        return offerAmount > 50;
      }
      return true;
    });

    setUserPosts(filteredData);
  };

  const handleMyBids = () => {
    navigate("/admin/my-bid");
  };
  const getAuditTypesFilterValue = () => {
    let filterValue: number = 0;
    if (
      auditTypeFilters.PerformanceTesting &&
      auditTypeFilters.SmartContractAudit
    ) {
      filterValue = 1;
    } else if (
      auditTypeFilters.PenetrationTesting &&
      auditTypeFilters.PerformanceTesting
    ) {
      filterValue = 2;
    } else if (
      auditTypeFilters.SmartContractAudit &&
      auditTypeFilters.PerformanceTesting
    ) {
      filterValue = 3;
    } else if (auditTypeFilters.SmartContractAudit) {
      filterValue = 4;
    } else if (auditTypeFilters.PerformanceTesting) {
      filterValue = 5;
    } else if (auditTypeFilters.PenetrationTesting) {
      filterValue = 6;
    } else {
      filterValue = 0;
    }
    return filterValue;
  };

  useEffect(() => {
    auditDetailsPosts(
      currentPage + 1,
      active?.type,
      getAuditTypesFilterValue()
    );
  }, [
    currentPage,
    active?.type,
    amountFilter,
    auditTypeFilters,
    submitAudit,
    statusForExtended,
    extendForPatron,
  ]);

  useEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo(0, 0);
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);
  // GET AUDIT REQUEST POST

  const auditDetailsPosts = async (
    page: any,
    status: AUDIT_POST_STATUS_TYPES,
    auditTypeValue: any
  ) => {
    try {
      const lowerAmount = amountFilter.split("-")[0]
        ? amountFilter.split("-")[0]
        : amountFilter.split("+")[0]
        ? amountFilter.split("+")[0]
        : "";
      const higerAmount = amountFilter.split("-")[1]
        ? amountFilter.split("-")[1]
        : amountFilter.split("+")[0]
        ? 5000
        : "";
      let auditType: any = "";
      if (auditTypeValue !== 0) {
        auditType = auditTypeValue;
      }
      const result: any = await getAllAuditDetails(
        userEmail,
        page,
        limit,
        status,
        lowerAmount,
        higerAmount,
        auditType
      );
      if (result?.status === 200) {
        const updatedResult = await result?.data?.map((item: any) => {
          item.createdtimestamp = moment(item?.createdAt).format(" DD/MM/YYYY");
          item.estimatedDelivery = moment(
            Number(item?.estimatedDelivery)
          ).format("DD/MM/YYYY");
          item.lastName = item?.lastName === null ? "" : item?.lastName;
          return item;
        });
        setUserPosts(updatedResult);
        setCount(result?.count);
        setTotalPages(result?.pages);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const filterDataValue = async (e: string) => {
    setCurrentPage(0);
    if (e === "Performance Testing") {
      setAuditTypeFilters({
        ...auditTypeFilters,
        PerformanceTesting: !auditTypeFilters?.PerformanceTesting,
      });
    } else if (e === "Penetration Testing") {
      setAuditTypeFilters({
        ...auditTypeFilters,
        PenetrationTesting: !auditTypeFilters?.PenetrationTesting,
      });
    } else {
      setAuditTypeFilters({
        ...auditTypeFilters,
        SmartContractAudit: !auditTypeFilters?.SmartContractAudit,
      });
    }
  };
  /**
   * this function handles the post type selected by the user
   * @param newPostType this is the post type that users wants to see and it can be among the following types "PENDING" "IN_PROGRESS" "SUBMITTED" "COMPLETED"
   * @param tabKey unique identifier for the post type
   */
  const handlePostTypeChange = (
    newPostType: AUDIT_POST_STATUS_TYPES,
    tabKey: string
  ) => {
    dispatch(setUserActiveTab({ type: newPostType, eventNumber: tabKey }));
    setCurrentPage(0);
  };
  return (
    <>
      <section className="profile_sec">
        <Tab.Container
          id="left-tabs-example"
          defaultActiveKey={active?.eventNumber}
        >
          <Container fluid>
            <Row className="justify-content-between align-items-center">
              <Col xl={8}>
                <Nav variant="pills">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="first"
                      onClick={() => {
                        handlePostTypeChange(ALL, "first");
                      }}
                    >
                      All
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="second"
                      onClick={() => {
                        handlePostTypeChange(PENDING, "second");
                      }}
                    >
                      Pending Audits
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="fourth"
                      onClick={() => {
                        handlePostTypeChange(INPROGRESS, "fourth");
                      }}
                    >
                      In Progress Audits
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link
                      eventKey="fifth"
                      onClick={() => {
                        handlePostTypeChange(SUBMITTED, "fifth");
                      }}
                    >
                      Submitted Audits
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="third"
                      onClick={() => {
                        handlePostTypeChange(COMPLETED, "third");
                      }}
                    >
                      Complete Audits
                    </Nav.Link>
                  </Nav.Item>
                  <Dropdown
                    title={
                      <>
                        <FilterIcon />
                        <span className="ms-3">Filter</span>
                      </>
                    }
                    menuClassName="nested-menu"
                    buttonClassName="drop_btn mb-3"
                    position="right"
                  >
                    <Dropdown.Item>
                      Offer Amount
                      <Dropdown.Submenu position="right" className="sub_menu">
                        <Dropdown.Item onClick={() => filterByAmountRange("")}>
                          Default
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => filterByAmountRange("0-11")}
                        >
                          0-10
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => filterByAmountRange("11-51")}
                        >
                          11-50
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => filterByAmountRange("51")}
                        >
                          51 or above
                        </Dropdown.Item>
                      </Dropdown.Submenu>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      Audit Type
                      <Dropdown.Submenu position="right" className="sub_menu">
                        <Dropdown.Item className="item_drop">
                          <Form.Check
                            checked={auditTypeFilters.PerformanceTesting}
                            onChange={() =>
                              filterDataValue("Performance Testing")
                            }
                            label="Performance Testing"
                          />
                        </Dropdown.Item>
                        <Dropdown.Item className="item_drop">
                          <Form.Check
                            checked={auditTypeFilters.PenetrationTesting}
                            onChange={() =>
                              filterDataValue("Penetration Testing")
                            }
                            label="Penetration Testing"
                          />
                        </Dropdown.Item>
                        <Dropdown.Item className="item_drop">
                          <Form.Check
                            checked={auditTypeFilters.SmartContractAudit}
                            onChange={() =>
                              filterDataValue("Smart Contract Testing")
                            }
                            label="Smart Contract Testing"
                          />
                        </Dropdown.Item>
                      </Dropdown.Submenu>
                    </Dropdown.Item>
                  </Dropdown>
                </Nav>
              </Col>
              <Col xl={4}>
                <ButtonCustom
                  title="Bid"
                  className="bid_btn"
                  onClick={handleMyBids}
                />
                <p className="status_text text-dark text-end">
                  {active?.type === "" && (
                    <>
                      {"Total Audits:"}
                      {count}
                    </>
                  )}
                  {active?.type === "IN_PROGRESS" && (
                    <>
                      {"In Progress Audits:"}
                      {count}
                    </>
                  )}
                  {active?.type === "PENDING" && (
                    <>
                      {"Pending audits:"}
                      {count}
                    </>
                  )}
                  {active?.type === "SUBMITTED" && (
                    <>
                      {"Submitted audits:"}
                      {count}
                    </>
                  )}
                  {active?.type === "COMPLETED" && (
                    <>
                      {"Completed audits:"}
                      {count}
                    </>
                  )}
                </p>
              </Col>
            </Row>
            <Row>
              <Col lg={12} xxl={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Row className="inner_row">
                      {userPosts?.length === 0 ? (
                        <Col>
                          <div className="d-flex justify-content-center my-2">
                            <NoPostFound />
                          </div>
                        </Col>
                      ) : (
                        userPosts?.map((item: any, index: any) => (
                          <Col lg={6} md={6} sm={12} key={index}>
                            <DashboardCard
                              extendbtn
                              extendedTime={item}
                              id={item?.postID}
                              name={item?.firstName}
                              surName={item?.lastName}
                              icon={item?.profilePicture}
                              date={item?.createdtimestamp}
                              email={item?.emailAddress}
                              auditType={item?.auditType}
                              gitUrl={
                                item?.gitHub && (
                                  <a
                                    href={item?.gitHub}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item?.gitHub.slice(0, 25)}
                                    {item?.gitHub.length > 25 ? "..." : ""}
                                  </a>
                                )
                              }
                              offerAmount={item?.offerAmount}
                              estimatedDelivery={item?.estimatedDelivery}
                              userType={item?.userType}
                              to={
                                item?.status === "IN_PROGRESS"
                                  ? "/admin/my-profilepage"
                                  : item?.status === "PENDING"
                                  ? "/admin/my-profilepage"
                                  : item?.status === "SUBMITTED"
                                  ? "/admin/pending-audits"
                                  : ""
                              }
                              status={item?.status}
                              userPosts={item}
                            />
                          </Col>
                        ))
                      )}
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <Row className="inner_row">
                      {userPosts?.length === 0 ? (
                        <Col>
                          <div className="d-flex justify-content-center my-md-5 my-3">
                            <NoPostFound />
                          </div>
                        </Col>
                      ) : (
                        userPosts?.map((item: any, index: any) => (
                          <Col lg={6} md={6} sm={12} key={index}>
                            <DashboardCard
                              extendbtn
                              extendedTime={item}
                              id={item?.postID}
                              name={item?.firstName}
                              surName={item?.lastName}
                              icon={item?.profilePicture}
                              date={item?.createdtimestamp}
                              email={item?.emailAddress}
                              auditType={item?.auditType}
                              gitUrl={
                                item?.gitHub && (
                                  <a
                                    href={item?.gitHub}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item?.gitHub.slice(0, 25)}
                                    {item?.gitHub.length > 25 ? "..." : ""}
                                  </a>
                                )
                              }
                              offerAmount={item?.offerAmount}
                              estimatedDelivery={item?.estimatedDelivery}
                              userType={item?.userType}
                              to={"/admin/my-profilepage"}
                              status={item?.status}
                              userPosts={item}
                            />
                          </Col>
                        ))
                      )}
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Row className="inner_row">
                      {userPosts?.length === 0 ? (
                        <Col>
                          <div className="d-flex justify-content-center my-sm-5 my-3">
                            <NoPostFound />
                          </div>
                        </Col>
                      ) : (
                        userPosts?.map((item: any, index: any) => (
                          <Col xl={6} md={6} sm={12} key={index}>
                            <DashboardCard
                              extendbtn
                              extendedTime={item}
                              id={item?.postID}
                              name={item?.firstName}
                              surName={item?.lastName}
                              icon={item?.profilePicture}
                              date={item?.createdtimestamp}
                              email={item?.emailAddress}
                              auditType={item?.auditType}
                              gitUrl={
                                item?.gitHub && (
                                  <a
                                    href={item?.gitHub}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item?.gitHub.slice(0, 25)}
                                    {item?.gitHub.length > 25 ? "..." : ""}
                                  </a>
                                )
                              }
                              offerAmount={item?.offerAmount}
                              estimatedDelivery={item?.estimatedDelivery}
                              userType={item?.userType}
                              to={"/admin/my-profilepage"}
                              status={item?.status}
                              userPosts={item}
                            />
                          </Col>
                        ))
                      )}
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Row className="inner_row">
                      {userPosts?.length === 0 ? (
                        <Col>
                          <div className="d-flex justify-content-center my-sm-5 my-3">
                            <NoPostFound />
                          </div>
                        </Col>
                      ) : (
                        userPosts?.map((item: any, index: any) => (
                          <Col xl={6} md={6} sm={12} key={index}>
                            <DashboardCard
                              extendbtn
                              extendedTime={item}
                              id={item?.postID}
                              name={item?.firstName}
                              surName={item?.lastName}
                              icon={item?.profilePicture}
                              date={item?.createdtimestamp}
                              email={item?.emailAddress}
                              auditType={item?.auditType}
                              gitUrl={
                                item?.gitHub && (
                                  <a
                                    href={item?.gitHub}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item?.gitHub.slice(0, 25)}
                                    {item?.gitHub.length > 25 ? "..." : ""}
                                  </a>
                                )
                              }
                              offerAmount={item?.offerAmount}
                              estimatedDelivery={item?.estimatedDelivery}
                              userType={item?.userType}
                              to={""} //completed
                              status={item?.status}
                              userPosts={item}
                            />
                          </Col>
                        ))
                      )}
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fifth">
                    <Row className="inner_row">
                      {userPosts?.length === 0 ? (
                        <Col>
                          <div className="d-flex justify-content-center my-5">
                            <NoPostFound />
                          </div>
                        </Col>
                      ) : (
                        userPosts?.map((item: any, index: any) => (
                          <Col xl={6} md={6} sm={12} key={index}>
                            <DashboardCard
                              extendbtn
                              extendedTime={item}
                              id={item?.postID}
                              name={item?.firstName}
                              surName={item?.lastName}
                              icon={item?.profilePicture}
                              date={item?.createdtimestamp}
                              email={item?.emailAddress}
                              auditType={item?.auditType}
                              gitUrl={
                                item?.gitHub && (
                                  <a
                                    href={item?.gitHub}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item?.gitHub.slice(0, 25)}
                                    {item?.gitHub.length > 25 ? "..." : ""}
                                  </a>
                                )
                              }
                              offerAmount={item?.offerAmount}
                              estimatedDelivery={item?.estimatedDelivery}
                              userType={item?.userType}
                              to={"/admin/pending-audits"} //submitted
                              status={item?.status}
                              userPosts={item}
                            />
                          </Col>
                        ))
                      )}
                    </Row>
                  </Tab.Pane>

                  {count > limit ? (
                    <CustomPagination
                      activePageNumber={currentPage}
                      className="dashboard-pagination"
                      pageCount={totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageChange}
                    />
                  ) : null}
                </Tab.Content>
              </Col>

              <Col xxl={4} md={8} sm={12}>
                <ProfileBio />
              </Col>
            </Row>
          </Container>
        </Tab.Container>
      </section>
    </>
  );
};

export default MyProfile;
