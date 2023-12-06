import React, { PropsWithChildren } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'react-bootstrap'
import { Defaults } from '@utils/defaults'


interface OprtionsI {
    header: string,
    className?: string,
    show?: boolean,
    showBtnSave?: boolean,
    onSave?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
    onHide: () => void
}

const defaults: Defaults<OprtionsI> = {
    className: '',
    show: false,
    showBtnSave: false,
    onSave: () => { }
}

export default function CustomModal(props: PropsWithChildren<OprtionsI>) {
    const mergedProps = Object.assign({}, defaults, props)
    const { children, header, className, show, showBtnSave, onSave, onClose, onHide } = mergedProps

    return (
        <>
            <Modal show={show} className={className + ' mt-5 '} onHide={onHide}>
                <ModalHeader closeButton>
                    <Modal.Title>{header}</Modal.Title>
                </ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
                <ModalFooter>
                    <Button className={showBtnSave ? ' ' : ' d-none '} color="primary" onClick={onSave}>Сохранить</Button>{' '}
                    <Button color="secondary" onClick={onClose}>Закрыть</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}