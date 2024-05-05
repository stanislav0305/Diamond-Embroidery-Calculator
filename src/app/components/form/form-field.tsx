import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { useField } from 'formik';


type FormFieldProps = React.HTMLAttributes<HTMLInputElement> & {
    name: string,
    type?: string,
    label?: string,
    as?: React.ElementType,
    placeholder?: string,
    disabled?: boolean,
    showValInSpan?: boolean,
    classNameForSpan?: string | undefined
    prefixReactNode?: React.ReactNode
    postfixReactNode?: React.ReactNode
    value?: any,
}

export default function FormField({ className, classNameForSpan, prefixReactNode, postfixReactNode, name, label, type, as, showValInSpan, value, ...props }: FormFieldProps) {
    const [field, meta] = useField(name)
    field.value = value ?? field.value
    const isValid = meta.touched && meta.error === undefined;
    const isInvalid = meta.touched && meta.error !== undefined;

    return (
        <Form.Group className={className} controlId={name}>
            {label && <Form.Label>{label}</Form.Label>}

            {label && showValInSpan && <span className={classNameForSpan}>{field.value}</span>}
            <InputGroup size="sm" className='mb-1'>
                {prefixReactNode &&
                    <InputGroup.Text className='p-1'>
                        {prefixReactNode}
                    </InputGroup.Text>
                }
                {!label && showValInSpan &&
                    <InputGroup.Text className={`${classNameForSpan} p-1`}>
                        {field.value}
                    </InputGroup.Text>
                }
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
                {postfixReactNode &&
                    <InputGroup.Text className='p-1'>
                        {postfixReactNode}
                    </InputGroup.Text>
                }
            </InputGroup>
            {isInvalid && <Form.Text className="text-danger">{meta.error}</Form.Text>}
        </Form.Group>
    )
}