import React from 'react'
import { Toast } from 'react-bootstrap'
import { Variant } from 'react-bootstrap/esm/types'
import { ActionType } from '@shared/types/actionType'


export interface EventMessagePropsI {
    elementiId: string
    title: string
    action: ActionType
    variant: Variant
    description: string
    secAgo: number
    show: boolean
    hasError: boolean
    errorDescription: string
    additionalDescription: string
    onClose: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void
}

export const actionIconCss: Map<ActionType, string> = new Map<ActionType, string>([
    ['created', 'bi-plus-square-fill'],
    ['updated', 'bi-pencil-fill'],
    ['removed', 'bi-trash3-fill'],
    ['info', 'bi-info-circle-fill'],
    ['error', 'bi-exclamation-triangle-fill']
])

export default function EventMessage(props: EventMessagePropsI) {
    return (
        <Toast bg={props.variant}
            className='mt-2 mx-2'
            onClose={(e) => props.onClose(props.elementiId, e)}
            show={props.show}
        >
            <Toast.Header>
                <i className={`bi me-1 ${actionIconCss.get(props.action)}`}></i>
                <strong className="me-auto">{props.title}</strong>
                <small>{props.secAgo} сек. назад</small>
            </Toast.Header>
            <Toast.Body>{props.description}</Toast.Body>
        </Toast >
    )
}