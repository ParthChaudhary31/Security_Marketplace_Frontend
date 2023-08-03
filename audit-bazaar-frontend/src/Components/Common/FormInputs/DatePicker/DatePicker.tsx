import  { ReactNode } from "react";
import { Form } from "react-bootstrap";
// import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type propTypes = {
  label?: string | ReactNode;
  rows?: number;
  id?: string;
  className?: string;
  onChange?: any;
  name?: any;
  placeholder?: string;
  Dateclass?: string;
  value?: any;
  type?: any;
  inputName?: any;
  autoFocus?: any;
  isInvalid?: any;
  error?: any;
  minDate?: Date;
};

//fn PICKING DATE
const DatePicker = (props: propTypes) => {
  const minDate =
    props.minDate instanceof Date
      ? props.minDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

  return (
    <>
      <Form.Group
        className={`customInput ${props.className}`}
        controlId={props.id}
      >
        {props.label && <Form.Label>{props.label}</Form.Label>}
        <Form.Control
          type="date"
          placeholder={props.placeholder}
          className={props.Dateclass}
          name={props.name}
          onChange={props.onChange}
          value={props.value}
          min={minDate}
        />
      </Form.Group>
    </>
  );
};

export default DatePicker;
