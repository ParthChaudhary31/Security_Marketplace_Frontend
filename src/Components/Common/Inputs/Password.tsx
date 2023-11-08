import { Form } from "react-bootstrap";
import { allowOnlyString } from "../../../Services/common.service";
import "./InputCustom.scss";
import { useState } from "react";
import { CloseEye, EyeIcon } from "../../../Assets/Images/Icons/SvgIcons";

/** CUSTOM COMMON INPUT FIELD WITH DYNAMIC PROPS */
const Password = (props: any) => {
  /** RESTRICT USER TO ENTER e, E, +, -, . IN INPUT TYPE NUBER */
  const disabledCharacters = ["e", "E", "+", "-"];
  const onKeyDown = (e: any) => {
    if (props?.disableDecimal) {
      disabledCharacters.push(".");
    }

    /** RESTRICT USER TO ENTER MORE THEN MAX LENGTH IN INPUT TYPE NUBER */
    return props?.type === "number"
      ? (disabledCharacters.includes(e.key) ||
          (e.key !== "Backspace" &&
            props?.maxlength &&
            e.target.value.length === props?.maxlength)) &&
          e.preventDefault()
      : props?.onlyChar
      ? !allowOnlyString(e.key) && e.preventDefault()
      : e.ctrlKey
      ? e.preventDefault()
      : null;
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleCopyPaste = (e: any) => {
    if (props?.disablePaste) {
      e.preventDefault();
    }
  };
  return (
    <>
      <Form.Group
        className={`customInput ${props?.className}`}
        controlId={props?.controlId}
      >
        {props?.label ? (
          <Form.Label htmlFor={props?.id} className={props?.classLabel}>
            {props?.label}
          </Form.Label>
        ) : (
          ""
        )}
        <div className="customInput_inner">
          {props?.leftIcon && (
            <span
              className={`${
                props?.leftIconClick ? "cursor-pointer" : ""
              } leftIcon`}
              onClick={props?.leftIconClick}
            >
              setShowPassword
              <img src={props?.leftIcon} alt="" />
            </span>
          )}
          <Form.Control
            disabled={props?.disabled}
            type={showPassword ? "text" : "password"}
            id={props?.id}
            name={props?.name}
            value={props?.value}
            onKeyDown={onKeyDown}
            placeholder={props?.placeholder}
            onBlur={props?.onBlur}
            onChange={props?.onChange}
            maxLength={props?.maxLength ? props?.maxLength : ""}
            required={props?.required}
            min={props?.min}
            max={props?.max}
            isInvalid={props?.isInvalid}
            onCopy={handleCopyPaste}
            onPaste={(e: any) =>
              props?.disablePaste ? e.preventDefault() : null
            }
            onWheel={props?.onWheel}
            step={props?.step}
            autoComplete={props?.onlyChar ? props?.autoComplete : "off"}
            pattern="\S(.*\S)?"
            title={props?.title ? props?.title : "Blank space are not allowed"}
            onInvalid={props?.onInvalid}
            onInput={props?.onInput}
            className={props?.inputName}
            readOnly={props?.readOnly}
          />
          {props?.children}
          {props?.rightIcon && (
            <span
              className={`cursor-pointer rightIcon ${props?.iconClr}`}
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <EyeIcon /> : <CloseEye />}
            </span>
          )}
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
export default Password;
