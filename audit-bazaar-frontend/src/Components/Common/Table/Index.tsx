import React, { ReactNode, useState } from "react";
import { Table } from "react-bootstrap";
import { NoRecord, SortIcon } from "../../../Assets/Images/Icons/SvgIcons";
import "./Index.scss";

const CustomTable = ({
  className,
  fields,
  sortbuttons,
  children,
  noRecordFound,
}: {
  className?: string;
  fields?: string[];
  sortbuttons?: boolean;
  children?: ReactNode;
  noRecordFound?: ReactNode;
}) => {
  const [active, setActive] = useState(false);
  return (
    <Table responsive className={`common_table ${className}`}>
      {fields && (
        <thead>
          <tr>
            {fields?.map((item) => (
              <th key={item}>
                <div className="d-flex align-items-center">
                  {item}
                  {sortbuttons && (
                    <span
                      onClick={() => setActive(!active)}
                      className={`sort_icon ${active ? "up_active" : "down_active"
                        }`}
                    >
                      <SortIcon />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {children || noRecordFound || (
          <tr className="no_record text-center">
            <td colSpan={fields?.length}>
              {noRecordFound || (
                <div className="no_record_box">
                  <NoRecord />
                  <h4>No Record Found</h4>
                </div>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

CustomTable.defaultProps = {
  sortbuttons: true,
};
export default CustomTable;
