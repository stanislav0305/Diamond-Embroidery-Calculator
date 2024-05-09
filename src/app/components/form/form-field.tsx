import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { useField } from 'formik'
import { BaseFormat } from '@components/inputs/types'


type FormFieldProps = {
    name: string,
    type?: string,
    label?: string,
    className?: string,
    as?: React.ElementType,
    placeholder?: string,
    disabled?: boolean,
    showValInSpan?: boolean,
    classNameForSpan?: string | undefined
    prefixReactNode?: React.ReactNode
    postfixReactNode?: React.ReactNode
    value?: any,
    displayType?: 'input' | 'text'
}

export default function FormField({ className, classNameForSpan, prefixReactNode, postfixReactNode, name,
    label, type, as, showValInSpan, value, displayType = 'input' }: FormFieldProps) {
    const [field, meta, helpers] = useField(name)

    field.value = value ?? field.value
    const isValid = meta.touched && meta.error === undefined;
    const isInvalid = meta.touched && meta.error !== undefined;
    const propAs = as
    const isBaseFormat: boolean = typeof propAs === typeof BaseFormat

    return (
        <Form.Group className={className}>
            {label &&
                <Form.Label>{label}</Form.Label>
            }
            {showValInSpan &&
                <span className={classNameForSpan}>{field.value}</span>
            }

            {!showValInSpan &&
                <InputGroup size="sm" className='mb-1'>
                    {prefixReactNode &&
                        <InputGroup.Text className='p-1'>
                            {prefixReactNode}
                        </InputGroup.Text>
                    }

                    {displayType === 'input' &&
                        <Form.Control
                            as={propAs}
                            size="sm"
                            name={name}
                            type={type}

                            value={field.value}
                            isValid={isValid}
                            isInvalid={isInvalid}

                            {...(isBaseFormat && {
                                displayType: 'input',
                                helpers: helpers,
                            })}
                            {...(!isBaseFormat && {
                                onChange: field.onChange,
                                onBlur: field.onBlur
                            })}
                        />
                    }

                    {displayType === 'text' &&
                        <InputGroup.Text
                            as={propAs}
                            size="sm"

                            name={name}
                            value={field.value}

                            {...(isBaseFormat && {
                                displayType: 'text',
                                helpers: helpers,
                            })}
                        >
                            {field.value}
                        </InputGroup.Text>
                    }

                    {postfixReactNode &&
                        <InputGroup.Text className='p-1'>
                            {postfixReactNode}
                        </InputGroup.Text>
                    }
                </InputGroup>
            }

            {
                showValInSpan || (!showValInSpan && displayType === 'text') &&
                <Form.Control
                    as={propAs}
                    size="sm"
                    name={name}
                    type="hidden"
                    value={field.value}

                    isValid={isValid}
                    isInvalid={isInvalid}

                    {...(isBaseFormat && {
                        displayType: 'input',
                        helpers: helpers,
                    })}
                    {...(!isBaseFormat && {
                        onChange: field.onChange,
                        onBlur: field.onBlur
                    })}
                />
            }

            {isInvalid && <Form.Text className="text-danger">{meta.error}</Form.Text>}
        </Form.Group >
    )
}