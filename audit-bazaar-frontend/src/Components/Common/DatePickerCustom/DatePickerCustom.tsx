import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calenderIcon from "../../../Assets/Images/Icons/calenderIcon.svg";
import moment from "moment";
import "./DatePickerCustom.scss";

const DatePickerCustom = ({ className, callback, type, reset, label }: any) => {
  // const [startDate, setStartDate] = useState(new Date) as any;
  const [startDate, setStartDate] = useState() as any;

  useEffect(() => {
    if (reset === true) {
      setStartDate();
    }
  }, [reset]);

  //Fn VERIFY DATE
  const onChangeHandler = (date: any) => {
    let final = moment(date).format("YYYY-MM-DD");
    callback(type, final);
    setStartDate(date);
  };
  return (
    <div
      className={`datepicker-style d-inline-flex align-items-center ${className}`}
    >
      <label>{label}</label>
      <img src={calenderIcon} alt="icon" />
      <div className="datepicker-style__wrap">
        <small className="d-block">
          {type == "start" ? "From" : "To"} Date
        </small>
        <DatePicker
          calendarClassName="ankit-d"
          selected={startDate}
          onChange={(date: Date) => {
            onChangeHandler(date);
          }}
          placeholderText="DD/MM/YYYY"
          maxDate={new Date()}
        />
      </div>
    </div>
  );
};

export default DatePickerCustom;
