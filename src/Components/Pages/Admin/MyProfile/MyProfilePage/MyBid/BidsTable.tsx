import React, { Dispatch, useEffect, useState } from "react";
import "./BidsTable.scss";
import CustomTable from "../../../../../Common/Table/Index";
import { myBids } from "../../../../../../Api/Actions/user.action";
import { useDispatch, useSelector } from "react-redux";

import NoDataFound from "../../../../../Common/NoDataFound/NoDataFound";
import moment from "moment";
import BackButton from "../../../../../Common/BackButton/BackButton";
import CustomPagination from "../../../../../Common/CustomPagination/CustomPagination";
import { setPaginationForBidTable } from "../../../../../../Redux/userData/userData";

let limit: number = 10;

const BidsTable = () => {
  const fields = [
    "Post Id",
    "Patron",
    "Offered Amount",
    "Expected Timeline",
    "Status",
  ];
  const emailAddress = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const activePage = useSelector(
    (state: any) => state?.userDataSlice?.paginationForBidTable
  );
  const [myBidData, setMyBidData] = useState<any>();
  const dispatch: Dispatch<any> = useDispatch();
  const [currentPage, setCurrentPage] = useState(activePage);
  const [totalPages, setTotalPages] = useState(1);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [count, setCount] = useState<any>(0);

  const fetchMyBids = async (page: number) => {
    try {
      const result = await myBids(emailAddress, page, limit);
      if (result?.status === 200) {
        const updatedResult: any = await result?.data?.map((item: any) => {
          item.estimatedDelivery = moment(
            Number(item?.estimatedDelivery)
          ).format("DD/MM/YYYY");
          return item;
        });
        setMyBidData(updatedResult);
        setCount(result?.count);
        const totalPosts = result?.count || 0;
        setTotalPages(Math.ceil(totalPosts / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const itemsPerPage = 10;
  const handlePageChange = async (selected: any) => {
    setCurrentPage(selected.selected);
    dispatch(setPaginationForBidTable(selected.selected));
    setShouldScrollToTop(true);
  };

  useEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo(0, 0);
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);
  useEffect(() => {
    fetchMyBids(currentPage + 1);
  }, [emailAddress, currentPage + 1]);
  return (
    <>
      <BackButton page={"profile"} />
      <CustomTable fields={fields}>
        {myBidData?.length > 0 ? (
          myBidData?.map((item: any, index: any) => {
            const statusClass =
              item?.status === "PENDING"
                ? "blue"
                : item?.status === "CONFIRM"
                ? "green"
                : item?.status === "SUCCESS"
                ? "green"
                : item?.status === "FAILED"
                ? "red"
                : item?.status === "COMPLETED"
                ? "green"
                : "";

            return (
              <tr key={index}>
                <td className="text-start">{item?.postID}</td>
                <td className="text-start">{item?.posterEmailAddress}</td>
                <td className="text-start">{item?.estimatedAmount}</td>
                <td className="text-start">{item?.estimatedDelivery}</td>
                <td style={{ color: statusClass }}>{item?.status}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={5}>
              <NoDataFound />
            </td>
          </tr>
        )}
      </CustomTable>
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
    </>
  );
};

export default BidsTable;
