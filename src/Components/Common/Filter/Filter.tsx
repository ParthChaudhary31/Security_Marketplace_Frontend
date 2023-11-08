import DatePickerCustom from "../DatePickerCustom/DatePickerCustom";
import serachIcon from "../../../Assets/Images/Icons/serachIcon.svg";
import { useState } from "react";
import ButtonCustom from "../Button/ButtonCustom";
import "./Filter.scss";
import CustomSelect from "../Select/Select";
import InputCustom from "../Inputs/InputCustom";

const Filter = ({
  isSearchable,
  callback,
  isKycView = false,
  dateResetCallback,
}: any) => {
  const [isReset, setIsReset] = useState(false);

  const dateHandler = (type: string, data: any) => {
    callback(type, data);
    setIsReset(false);
  };

  //handler to reset start date and end date
  const handlerToResetDateFilter = () => {
    dateResetCallback();
    setIsReset(true);
  };

  const options = [
    { value: "Done", label: "Done" },
    { value: "pending", label: "Pending" },
  ];
  return (
    <div className="filter d-flex justify-content-between align-items-end align-items-md-center">
      <div className="d-flex flex-column flex-md-row align-items-md-center">
        <div className="filter__fields d-flex flex-wrap flex-md-nowrap">
          {isSearchable && (
            <div className="filter__search">
              <img
                src={serachIcon}
                alt="icon"
                className="filter__search__icon"
              />
              <InputCustom className="mb-0" placeholder="Search" />
            </div>
          )}
          <DatePickerCustom
            type="start"
            callback={dateHandler}
            reset={isReset}
          />
          <DatePickerCustom type="end" callback={dateHandler} reset={isReset} />
          <ButtonCustom
            className="btn-style red-btn"
            title={"Reset"}
            onClick={() => {
              handlerToResetDateFilter();
            }}
          />
        </div>
      </div>
      <CustomSelect placeholder="All" options={options} />
    </div>
  );
};

export default Filter;
