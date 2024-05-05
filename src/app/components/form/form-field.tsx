import React from 'react'
import { Form } from 'react-bootstrap'
import { useField } from 'formik';


type FormFieldProps = React.HTMLAttributes<HTMLInputElement> & {
    name: string,
    type?: string,
    label: string,
    as?: React.ElementType,
    placeholder?: string,
    disabled?: boolean,
    showValInSpan?: boolean,
}

export default function FormField({ className, name, label, type, as, showValInSpan, ...props }: FormFieldProps) {
    const [field, meta] = useField(name)
    const isValid = meta.touched && meta.error === undefined;
    const isInvalid = meta.touched && meta.error !== undefined;

    return (
        <Form.Group className={className} controlId={name}>
            <Form.Label>{label}</Form.Label>
            {showValInSpan && <span className="d-block">{field.value}</span>}
            <Form.Control
                size="sm"
                as={as}
                name={name}
                type={showValInSpan ? "hidden" : type}
                {...props}
                value={field.value}
                isValid={isValid}
                isInvalid={isInvalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
            />
            {isInvalid && <Form.Text className="text-danger">{meta.error}</Form.Text>}
        </Form.Group>
    )
}