import ReactPaginate from "react-paginate";
import {
  ArrowNextIcon,
  ArrowPrevIcon,
} from "../../../Assets/Images/Icons/SvgIcons";
import "./CustomPagination.scss";

const CustomPagination = ({
  activePageNumber,
  pageCount,
  marginPagesDisplayed,
  pageRangeDisplayed,
  onPageChange,
  className
  
}) => {
  return (
    <div className={`custom-pagination ${className}`}>
      <ReactPaginate
        forcePage={activePageNumber}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={marginPagesDisplayed}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={onPageChange}
        containerClassName={"pagination"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        breakLinkClassName={"page-link"}
        previousLinkClassName={"page"}
        breakClassName={"page"}
        nextLinkClassName={"page"}
        pageClassName={"page"}
        disabledClassName={"disabled"}
        activeClassName={"active"}
        previousLabel={<ArrowPrevIcon />}
        nextLabel={<ArrowNextIcon />}
      />
    </div>
  );
};

export default CustomPagination;
