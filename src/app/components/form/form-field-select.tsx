import React, { ReactNode } from 'react'
import { Form } from 'react-bootstrap'
import { useField } from 'formik'


type MainProps<OptionsTypes extends Map<string, string>> = { 
    name: string
    label: string
    placeholder?: string
    options: OptionsTypes
    disabled?: boolean
}

type FormFieldSelectProps<OptionsTypes extends Map<string, string>> = React.HTMLAttributes<HTMLSelectElement> & MainProps<OptionsTypes>

export default function FormFieldSelect<OT extends Map<string, string>>({ className, name, label, options, placeholder, disabled, ...props }: FormFieldSelectProps<OT>) {
    const [field, meta] = useField(name)
    const isValid = meta.touched && meta.error === undefined
    const isInvalid = meta.touched && meta.error !== undefined

    const optionsObjs: ReactNode[] = []
    options.forEach((value, key) =>
        optionsObjs.push(<option key={key} value={key}>{value}</option>)
    )

    return (
        <Form.Group className={className} controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Select
                size="sm"
                aria-label={label}
                name={name}
                {...props}
                value={field.value}
                isValid={isValid}
                isInvalid={isInvalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={disabled}
            >
                {placeholder && <option>{placeholder}</option>}
                {optionsObjs}
            </Form.Select>
            {isInvalid && <Form.Text className="text-danger">{meta.error}</Form.Text>}
        </Form.Group>
    )
}