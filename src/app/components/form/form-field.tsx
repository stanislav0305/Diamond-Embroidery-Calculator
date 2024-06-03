import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from 'formik'
import { BaseFormat } from '@components/inputs/types'


type Props = {
    name?: string
    value?: any
    inputType?: string
    inputDisplayType: "input" | "text" | undefined
    inputPlaceholder?: string
    field?: FieldInputProps<any>
    meta?: FieldMetaProps<any>
    helpers?: FieldHelperProps<any>
    as?: React.ElementType
    isValid: boolean
    isInvalid: boolean
    isBaseFormat: boolean
    inputGroupValueClassName?: string
    disabled?: boolean
}

function InputFormat(p: Props) {
    return (
        <Form.Control
            as={p.as}
            size="sm"
            name={p.name}
            type={p.inputType}
            disabled={p.disabled}
            
            value={p.value ?? p.field?.value}
            isValid={p.isValid}
            isInvalid={p.isInvalid}
            placeholder={p.inputPlaceholder}

            {...(p.isBaseFormat && {
                displayType: p.inputDisplayType,
                helpers: p.helpers,
            })}
            {...(!p.isBaseFormat && {
                onChange: p.field?.onChange,
                onBlur: p.field?.onBlur
            })}
        />
    )
}

function InputGroupTextFormat(p: Props) {
    return (
        <InputGroup.Text
            as={p.as}
            size="sm"

            name={p.name}
            className={p.inputGroupValueClassName}
            value={p.value ?? p.field?.value}

            {...(p.isBaseFormat && {
                displayType: 'text',
                helpers: p.helpers,
            })}
        >
            {p.value ?? p.field?.value}
        </InputGroup.Text>
    )
}

type FormFieldProps = {
    name?: string
    label?: string
    className?: string
    as?: React.ElementType
    prefixReactNode?: React.ReactNode
    postfixReactNode?: React.ReactNode
    value?: any

    addInputGroupInput?: boolean
    addInputGroupText?: boolean
    inputGroupValueClassName?: string

    addInput?: boolean
    inputClassName?: string
    inputType?: string
    inputPlaceholder?: string

    addText?: boolean
    addHiddenInput?: boolean

    disabled?: boolean
}

export default function FormField(ffp: FormFieldProps) {

    const [field, meta, helpers] = ffp.name ? useField(ffp.name) : [undefined, undefined, undefined]

    const p: Props = {
        name: ffp.name,
        value: ffp.value,
        inputType: ffp.inputType,
        inputPlaceholder: ffp.inputPlaceholder,
        inputDisplayType: 'input',
        field: field,
        meta: meta,
        helpers: helpers,
        as: ffp.as,
        isValid: meta ? (meta.touched && meta?.error === undefined) : true,
        isInvalid: meta ? (meta?.touched && meta?.error !== undefined) : false,
        isBaseFormat: typeof ffp.as === typeof BaseFormat,
        inputGroupValueClassName: ffp.inputGroupValueClassName,
        disabled: ffp.disabled,
    }


    return (
        <Form.Group className={ffp.className}>
            {ffp.label &&
                <Form.Label>{ffp.label}</Form.Label>
            }

            {(ffp.addInputGroupInput || ffp.addInputGroupText ||
                ffp.prefixReactNode || ffp.postfixReactNode) &&
                <InputGroup size="sm" className='mb-1'>
                    {(ffp.prefixReactNode) &&
                        ffp.prefixReactNode
                    }

                    {ffp.addInputGroupInput &&
                        <InputFormat {...p} />
                    }

                    {ffp.addInputGroupText &&
                        <InputGroupTextFormat {...p} />
                    }

                    {(ffp.postfixReactNode) &&
                        ffp.postfixReactNode
                    }
                </InputGroup>
            }

            {ffp.addInput &&
                <InputFormat {...p} />
            }

            {ffp.addText &&
                <InputFormat {...{
                    ...p,
                    inputPlaceholder: undefined,
                    displayType: 'text',
                }} />
            }

            {ffp.addHiddenInput &&
                <InputFormat {...{
                    ...p,
                    inputPlaceholder: undefined,
                    inputType: "hidden"
                }} />
            }

            {p.isInvalid &&
                <Form.Text className="text-danger">{p.meta?.error}</Form.Text>
            }
        </Form.Group >
    )
}