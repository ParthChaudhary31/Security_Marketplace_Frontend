import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./DatePickerCustom.scss";
import calenderIcon from "../../../Assets/Images/calenderIcon.svg";

const DatePickerCustom = ({
  className,
  type,
  onChange,
  label,
  dateFormat,
  data,
  check,
  checkSetter,
  dateType,
  resetState,
  setResetState,
}: any) => {
  const [startDate, setStartDate] = useState() as any;
  const [showError, setShowError] = useState(false);

  const onChangeHandler = (date: any) => {
    const finalDateSet = moment(date).format("DD/MM/YYYY");
    onChange(finalDateSet);

    data[dateType] = finalDateSet;
    checkSetter({ state: !check.state, value: finalDateSet });
    setStartDate(date);
    setShowError(false);
  };

  const onBlurHandler = () => {
    if (!startDate) {
      setShowError(true);
    }
  };

  useEffect(() => {
    if (resetState) {
      setStartDate("");
      setResetState(false);
    }
  }, [resetState]);
  const minDate = moment().add(1, "days").toDate();

  return (
    <>
      <label>{label}</label>
      <div className={`datepicker-style ${className}`}>
        <div className="datepicker-style__wrap">
          <small className="d-block">
            {type === "start" ? "From" : "To"} Date
          </small>
          <DatePicker
            calendarClassName="ankit-d"
            selected={startDate}
            onChange={(date: Date) => {
              onChangeHandler(date);
            }}
            placeholderText="DD/MM/YYYY"
            minDate={minDate}
            dateFormat={dateFormat}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            onBlur={onBlurHandler}
          />
        </div>

        <img src={calenderIcon} alt="icon" />
      </div>
      {showError && (
        <div className="error-message">*This field is required</div>
      )}
    </>
  );
};

export default DatePickerCustom;
