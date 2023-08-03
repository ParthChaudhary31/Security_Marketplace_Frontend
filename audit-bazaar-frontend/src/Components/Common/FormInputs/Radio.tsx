import React, { ReactNode } from 'react'
import { Form } from 'react-bootstrap'

type propTypes = {
    label?: string | ReactNode,
    id?: string,
    name?: string,
    disabled?: boolean,
    onChange?: any,
    value?: any,
    className?: string,
}

const Radio = (props: propTypes) => {
    return (
        <>
            <Form.Group className={`${props.className} checkbox_input`} controlId={props.id}>
                <Form.Check
                    type='radio'
                    label={props.label}
                    id={props.id}
                    name={props.name}
                    disabled={props.disabled}
                    onChange={props.onChange}
                    value={props.value}
                />
            </Form.Group>
        </>
    )
}

export default Radio
