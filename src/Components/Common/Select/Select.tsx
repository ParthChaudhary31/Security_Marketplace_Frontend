import React, { ReactNode } from "react";
import "./Select.scss";
import Select from "react-select";
import { Form } from "react-bootstrap";

type valueType = { value: string | number; label: string | ReactNode };
type propsType = {
  defaultValue?: valueType;
  onChange?: any;
  options?: valueType[];
  menuIsOpen?: boolean;
  className?: string;
  name?: string;
  placeholder?: any;
  id?: string;
  value?: any;
  closeMenuOnSelect?: any;
  hideSelectedOptions?: any;
  isMulti?: any;
  onBlur?: any;
  smallText?: any;
  error?: any;
};

const CustomSelect = ({
  className,
  menuIsOpen,
  defaultValue,
  onChange,
  options,
  name,
  placeholder,
  isMulti,
  closeMenuOnSelect,
  hideSelectedOptions,
  onBlur,
  error,

}: propsType) => {
  return (
    <>
          <Select
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={onChange}
            options={options}
            className={`common_select ${className}`}
            classNamePrefix={"select"}
            menuIsOpen={menuIsOpen}
            name={name}
            isSearchable={false}
            isMulti={isMulti}
            closeMenuOnSelect={closeMenuOnSelect}
            hideSelectedOptions={hideSelectedOptions}
            onBlur={onBlur}
            
          />
          {error ? (
            <Form.Text
              id=""
              className="small-text-form"
            >
              {error}
            </Form.Text>
          ) : (
            ""
          )}
    </>
  );
};

export default CustomSelect;
