import { Col, Container, Row, Form } from "react-bootstrap";
import DashboardCard from "./DashboardCard/DashboardCard";
import "./Dashboard.scss";
import CustomPagination from "../../../Common/CustomPagination/CustomPagination";
import { getAllAuditDetailsForPublic } from "../../../../Api/Actions/user.action";
import { Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setAuditReport } from "../../../../Redux/Audit/Audit.slice";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../../../Services/Helpers/stateManagement";
import {
  setStatusExtendedForAuditor,
  setUserDashboardTab,
} from "../../../../Redux/userData/userData";
import jwt_decode from "jwt-decode";
import { FilterIcon } from "../../../../Assets/Images/Icons/SvgIcons";
import Dropdown from "react-multilevel-dropdown";
import NoPostFound from "../../../Common/NoDataFound/NoPostFound";
import store from "../../../../Redux/store";

let limit: number = 9;
const Dashboard = () => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<any>([]);
  const [amountFilter, setAmountFilter] = useState<any>("");

  const dispatch: Dispatch<any> = useDispatch();

  const userEmail = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const jwt = useSelector(
    (state: any) => state?.authenticationDataSlice?.jwtToken
  );
  const activePage = useSelector(
    (state: any) => state?.userDataSlice?.userDashboardTab
  );

  const userData = useSelector((state: any) => state?.userDataSlice);
  const [count, setCount] = useState<any>(0);
  const [currentPage, setCurrentPage] = useState(activePage);
  const [totalPages, setTotalPages] = useState(1);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

  const [auditTypeFilters, setAuditTypeFilters] = useState<any>({
    PerformanceTesting: false,
    PenetrationTesting: false,
    SmartContractAudit: false,
  });
  const itemsPerPage = 9;

  const handlePageChange = async (selected: any) => {
    setCurrentPage(selected.selected);
    dispatch(setUserDashboardTab(selected.selected));
    setShouldScrollToTop(true);
  };

  useEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo(0, 0);
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);

  const MAX_GITHUB_URL_LENGTH = 30;
  const truncateGitHubURL = (url: string) => {
    if (url.length <= MAX_GITHUB_URL_LENGTH) return url;
    const frontPart = url.substring(0, MAX_GITHUB_URL_LENGTH / 2);
    const endPart = url.substring(url.length - MAX_GITHUB_URL_LENGTH / 2);
    return `${frontPart}...${endPart}`;
  };
  function isTokenExpired() {
    const currentTime = Math.ceil(Date.now() / 1000); // Convert to seconds
    const { exp }: any = jwt_decode(jwt); // Assuming you're using jwt_decode
    return exp < currentTime;
  }
  async function handleTokenExpiry() {
    const value = isTokenExpired();
    if (value) {
      navigate("/");
      handleLogout(navigate, userData);
    }
  }

  const filterByAmountRange = (range: any) => {
    setCurrentPage(0);
    setAmountFilter(range);
    const filteredData = userPosts?.filter((item: any) => {
      const offerAmount = item?.offerAmount;
      if (range === "0-10") {
        return offerAmount >= 0 && offerAmount <= 10;
      } else if (range === "11-50") {
        return offerAmount >= 11 && offerAmount <= 50;
      } else if (range === "51") {
        return offerAmount > 50;
      }
      return true;
    });
    setUserPosts(filteredData);
  };

  // GET AUDIT REQUEST POST FOR PUBLIC
  const auditDetailsPostForPublic = async (page: any, auditTypeValue?: any) => {
    try {
      const lowerAmount = amountFilter.split("-")[0]
        ? amountFilter.split("-")[0]
        : amountFilter.split("+")[0]
        ? amountFilter.split("+")[0]
        : 0;
      const higerAmount = amountFilter.split("-")[1]
        ? amountFilter.split("-")[1]
        : amountFilter.split("+")[0]
        ? 5000
        : "";

      let auditType: any = "";
      if (auditTypeValue !== 0) {
        auditType = auditTypeValue;
      }

      const result = await getAllAuditDetailsForPublic(
        userEmail,
        page,
        limit,
        lowerAmount,
        higerAmount,
        auditType
      );
      if (result?.status === 200) {
        const updatedResult = result?.data?.map((item: any) => ({
          ...item,
          createdtimestamp: moment(item?.createdAt).format("DD/MM/YYYY"),
          estimatedDeliverystamp: moment(
            Number(item?.estimatedDelivery)
          ).format("DD/MM/YYYY"),
          lastName: item?.lastName === null ? "" : item?.lastName,
        }));

        setUserPosts(updatedResult);
        dispatch(setAuditReport(updatedResult));
        setCount(result?.count);
        const totalPosts = result?.count || 0;
        setTotalPages(Math.ceil(totalPosts / itemsPerPage));
      } else if (result?.status === 401) {
        handleLogout(navigate, userData);
      }
    } catch (error) {
      console.error(error);
    }
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
    if (
      auditTypeFilters?.PenetrationTesting === true ||
      auditTypeFilters?.PerformanceTesting === true ||
      auditTypeFilters?.SmartContractAudit === true
    ) {
      auditDetailsPostForPublic(currentPage + 1, getAuditTypesFilterValue());
    } else {
      auditDetailsPostForPublic(currentPage + 1, getAuditTypesFilterValue());
    }
  }, [currentPage, amountFilter, auditTypeFilters]);

  useEffect(() => {
    handleTokenExpiry();
    store?.dispatch(setStatusExtendedForAuditor(false));
  }, []);

  const filterDataValue = async (e: string) => {
    setCurrentPage(0);
    if (e === "Performance Testing") {
      setAuditTypeFilters({
        ...auditTypeFilters,
        PerformanceTesting: !auditTypeFilters.PerformanceTesting,
      });
    } else if (e === "Penetration Testing") {
      setAuditTypeFilters({
        ...auditTypeFilters,
        PenetrationTesting: !auditTypeFilters.PenetrationTesting,
      });
    } else {
      setAuditTypeFilters({
        ...auditTypeFilters,
        SmartContractAudit: !auditTypeFilters.SmartContractAudit,
      });
    }
  };

  return (
    /*----------Dashboard sec starts-------------*/

    <section className="user_details">
      <Container fluid>
        <Row>
          <Col lg={12} className="mb-0">
            <Dropdown
              title={
                <>
                  <FilterIcon />
                  <span className="ms-3">Filter</span>
                </>
              }
              menuClassName="nested-menu"
              buttonClassName="drop_btn"
              position="right"
            >
              <Dropdown.Item>
                Offer Amount
                <Dropdown.Submenu position="right" className="sub_menu">
                  <Dropdown.Item
                    className="item_drop"
                    onClick={() => filterByAmountRange("")}
                  >
                    Default
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="item_drop"
                    onClick={() => filterByAmountRange("0-11")}
                  >
                    0-10
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="item_drop"
                    onClick={() => filterByAmountRange("10-51")}
                  >
                    11-50
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="item_drop"
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
                      checked={auditTypeFilters?.PerformanceTesting}
                      onChange={() => filterDataValue("Performance Testing")}
                      label="Performance Testing"
                    />
                  </Dropdown.Item>
                  <Dropdown.Item className="item_drop">
                    <Form.Check
                      checked={auditTypeFilters?.PenetrationTesting}
                      onChange={() => filterDataValue("Penetration Testing")}
                      label="Penetration Testing"
                    />
                  </Dropdown.Item>
                  <Dropdown.Item className="item_drop">
                    <Form.Check
                      checked={auditTypeFilters?.SmartContractAudit}
                      onChange={() => filterDataValue("Smart Contract Testing")}
                      label="Smart Contract Testing"
                    />
                  </Dropdown.Item>
                </Dropdown.Submenu>
              </Dropdown.Item>
            </Dropdown>
          </Col>
          {userPosts?.length === 0 ? (
            <Col>
              <NoPostFound />
            </Col>
          ) : (
            userPosts?.map((item: any, index: any) => (
              <Col xl={4} lg={4} md={6} sm={6} key={index}>
                <DashboardCard
                  extendbtn
                  icon={item?.profilePicture}
                  id={item?.postID}
                  name={item?.firstName}
                  surName={item?.lastName}
                  date={item?.createdtimestamp}
                  email={item?.emailAddress}
                  auditType={item?.auditType}
                  gitUrl={
                    truncateGitHubURL(item?.gitHub) && (
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
                  estimatedDelivery={item?.estimatedDeliverystamp}
                  userType={""}
                  to={"/admin/dashboard-listing"}
                  extendedTime={undefined}
                  status=""
                  userPosts={undefined}
                />
              </Col>
            ))
          )}
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
        </Row>
      </Container>
    </section>
    /*----------Dashboard sec ends-------------*/
  );
};

export default Dashboard;
