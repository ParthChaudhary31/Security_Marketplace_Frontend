import React, { ReactNode } from 'react'
import { Form } from 'react-bootstrap'

type propTypes = {
    label?: string | ReactNode,
    id?: string,
    name: string,
    disabled?: boolean,
    onChange?: any,
    value?: any,
    className?: string,
}

const Checkbox = (props: propTypes) => {
    return (
        <>
            <Form.Group className={`${props.className} checkbox_input`} controlId={props.id}>
                <Form.Check onChange={props.onChange} value={props.value} name={props.name} disabled={props.disabled} type="checkbox" label={props.label} />
            </Form.Group>
        </>
    )
}

export default Checkbox
