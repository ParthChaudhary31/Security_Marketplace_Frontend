import { Col, Row } from "react-bootstrap";
import "./Balance.scss";
import CustomTable from "../../../Common/Table/Index";
import { transactionHistory } from "../../../../Api/Actions/user.action";
import { Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import CustomPagination from "../../../Common/CustomPagination/CustomPagination";
import { setPaginationForBalance } from "../../../../Redux/userData/userData";

let limit: number = 10;
const Balance = () => {
  const userEmail = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const activePage = useSelector(
    (state: any) => state?.userDataSlice?.paginationForBalance
  );
  const [transactionData, setTransactionData] = useState([]);
  const dispatch: Dispatch<any> = useDispatch();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(activePage);
  const [totalPages, setTotalPages] = useState(1);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [count, setCount] = useState<any>(0);
  
  const itemsPerPage = 10;

  const handlePageChange = async (selected: any) => {
    setCurrentPage(selected.selected);
    dispatch(setPaginationForBalance(selected.selected));
    setShouldScrollToTop(true);
  };
 
  useEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo(0, 0);
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);

  const fields = ["Sr No.", "Hash", "Time & Date", "Transaction Type"];

  const transactionHistoryBalance = async (page: number) => {
    try {
      const result: any = await transactionHistory(userEmail, page, limit);
      if (result?.status === 200) {
        setTransactionData(result?.data);
        setLoading(false);
        setCount(result?.count);
        const totalPosts = result?.count || 0;
        setTotalPages(Math.ceil(totalPosts / itemsPerPage));
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  useEffect(() => {
    transactionHistoryBalance(currentPage+1);
  }, [currentPage+1]);
  return (
    <>
      <section className="balance_sec">
        <h4 className="common-heading">Balance</h4>
        <Row>
          <Col>
            <h6>Transactions</h6>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <CustomTable fields={fields} sortbuttons={true}>
                {transactionData?.map((item: any, index: any) => (
                  <tr key={index}>
                    <td>{activePage > 0 ? (index+1)+activePage*10:(index + 1)}</td>
                    <td className="text-start">
                      <a
                        href={`https://shibuya.subscan.io/block/${item?.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item?.transactionHash}
                      </a>
                    </td>
                    <td className="text-start">
                      {moment.unix(item?.timestamp / 1000).format("DD/MM/YYYY")}
                    </td>
                    <td className="text-start">{item?.transactionType}</td>
                  </tr>
                ))}
              </CustomTable>
            )}
          </Col>
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
      </section>
    </>
  );
};
export default Balance;
