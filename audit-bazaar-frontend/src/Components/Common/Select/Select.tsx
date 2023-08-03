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
  value?: any
  closeMenuOnSelect?: any
  hideSelectedOptions?: any
  isMulti?: any
};

const CustomSelect = ({
  className,
  menuIsOpen,
  defaultValue,
  onChange,
  options,
  name,
  id,
  placeholder,
  isMulti,
  closeMenuOnSelect,
  hideSelectedOptions
}: propsType) => {
  return (
    <>
      <Form>
        <Form.Group className="checkbox_input" controlId={id}>
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
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default CustomSelect;
