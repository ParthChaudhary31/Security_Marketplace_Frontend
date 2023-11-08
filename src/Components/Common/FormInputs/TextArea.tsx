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
  value?: any;
  type?: any;
  autoFocus?: any;
  isInvalid?: any;
  error?: any;
  inputName?: any;
  disabled?: boolean;
  defaultvalue?: any;
  readOnly?: boolean;
  onBlur?: any;
  smallText?: any
};

const TextArea = (props: propTypes) => {
  return (
    <>
      <Form.Group
        className={`customInput ${props?.className}`}
        controlId={props?.id}
      >
        {props?.label && <Form.Label>{props?.label}</Form.Label>}
        <div className="text_area">
          <Form.Control
            className="textarea"
            placeholder={props?.placeholder}
            name={props?.name}
            as="textarea"
            rows={props?.rows || 3}
            onChange={props?.onChange}
            value={props?.value}
            type={props?.type}
            autoFocus={props?.autoFocus}
            isInvalid={props?.isInvalid}
            disabled={props?.disabled}
            readOnly={props?.readOnly}
            onBlur={props?.onBlur}
          />
        </div>
        {props?.error}
        {props?.smallText ? (
          <Form.Text id="" muted className="small-text-form">
            {props?.smallText}
          </Form.Text>
        ) : (
          ""
        )}
      </Form.Group>

    </>
  );
};

export default TextArea;
