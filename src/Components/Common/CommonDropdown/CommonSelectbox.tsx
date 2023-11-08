import { useState } from "react";
import { NavLink } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import "./Dropdowns.scss";

const CommonSelectbox = ({
  className,
  icon,
  title,
  options,
  amountFilterVal,
}: {
  className: any;
  icon: any;
  title: any;
  options: any;
  amountFilterVal?: any;
}) => {
  const [value, setValue] = useState(title);
  if (amountFilterVal) amountFilterVal(value);

  return (
    <>
      <div className={`common_dropdown selectbox ${className || ""}`}>
        <Dropdown>
          <Dropdown.Toggle>
            <span className="common_dropdown_icon">{icon}</span>
            <span className="common_dropdown_title">{value}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu renderOnMount={true}>
            {options?.map((item: any, index: any) => (
              <NavLink
                key={index}
                className="dropdown-item"
                href={item?.to}
                onClick={() => {
                  setValue(item?.menu);
                }}
              >
                {item?.menu}
              </NavLink>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};
export default CommonSelectbox;
