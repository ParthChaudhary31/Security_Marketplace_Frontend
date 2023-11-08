import { ReactNode } from "react";
import { Form } from "react-bootstrap";

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
  InputName?: any;
  autoFocus?: any;
  isInvalid?: any;
  error?: any;
  minDate?: Date;
  readOnly?: any;
  onChangeRaw?: any;
  onBlur?: any;
  onClick?: any;
  callback?:any;
  reset?:any;
  dateFormat?:any;
};

const DatePicker = (props: propTypes) => {
  const minDate =
    props?.minDate instanceof Date
      ? props?.minDate?.toISOString()?.split("T")[0]
      : new Date().toISOString()?.split("T")[0];

  return (
    <>
      <Form.Group
        className={`customInput ${props?.className}`}
        controlId={props?.id}
      >
        {props?.label && <Form.Label>{props?.label}</Form.Label>}
        <Form.Control
          type="date" 
          placeholder={props?.placeholder}
          className={props?.Dateclass}
          name={props?.name}
          onChange={props?.onChange}
          value={props?.value}
          min={minDate}
          onClick={props?.onBlur}
          onBlur={props?.onBlur}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
      </Form.Group>
      {props?.error && <div className="error-message">This Field Is Required</div>}
    </>
  );
};

export default DatePicker;
