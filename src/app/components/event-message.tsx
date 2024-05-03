import React from 'react'
import { Toast } from 'react-bootstrap'
import { Variant } from 'react-bootstrap/esm/types';


export interface EventMessagePropsI {
    elementiId: number,
    title: string,
    action: ActionType,
    variant: Variant,
    description: string,
    secAgo: number,
    show: boolean,
    onClose: (id: number, e?: React.MouseEvent | React.KeyboardEvent) => void,
}

type ActionType = 'created' | 'updated' | 'removed' | 'info'
export const actionIconCss: Map<ActionType, string> = new Map<ActionType, string>([
    ['created', 'bi-plus-square-fill'],
    ['updated', 'bi-pencil-fill'],
    ['removed', 'bi-trash3-fill'],
    ['info', 'bi-info-circle-fill'],
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
    );
}