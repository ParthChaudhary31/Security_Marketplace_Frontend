import { NavLink } from "react-router-dom";
import {
  ArrowNextIcon,
  ArrowPrevIcon,
} from "../../../Assets/Images/Icons/SvgIcons";
import "./CustomPagination.scss";

const CustomPagination = (props: { className: string }) => {
  return (
    <div className="custom-pagination">
      <ul className={props?.className}>
        <li>
          <div className="custom-pagination__arrows">

            <span>
              <ArrowPrevIcon />
            </span>
          </div>
        </li>
        <li className="custom-pagination__no">
          <NavLink to=""><span>1</span></NavLink>
        </li>
        <li className="custom-pagination__no">
          <NavLink to=""><span>2</span></NavLink>
        </li>
        <li className="custom-pagination__no">
          <NavLink to=""><span>3</span></NavLink>
        </li>
        <li className="custom-pagination__no">
          <NavLink to=""><span>4</span></NavLink>
        </li>
        <li>
          <div className="custom-pagination__arrows">
            <span>
              <ArrowNextIcon />
            </span>

          </div>
        </li>
      </ul>
    </div>
  );
};

export default CustomPagination;
