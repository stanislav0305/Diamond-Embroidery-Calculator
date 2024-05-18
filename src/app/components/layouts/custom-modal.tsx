import React, { PropsWithChildren } from 'react'
import { Spinner } from 'react-bootstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'react-bootstrap'
import { Defaults } from '@utils/defaults'


export type ModalMode = 'loading' | 'loaded' | 'closed' | 'error'

interface OptionsI {
    header: string
    className?: string
    mode?: ModalMode
    confirmBtnText?: string
    onConfirm?: null | ((event: React.MouseEvent<HTMLButtonElement>) => void)
    closeBtnText?: string
    onClose?: null | ((event: React.MouseEvent<HTMLButtonElement>) => void)
    onHide: () => void
}

const defaults: Defaults<OptionsI> = {
    className: '',
    mode: 'closed',
    confirmBtnText: '',
    onConfirm: null,
    closeBtnText: 'Закрыть',
    onClose: null,
}


export default function CustomModal(props: PropsWithChildren<OptionsI>) {
    const mergedProps = Object.assign({}, defaults, props)
    const { children, header, mode, className, confirmBtnText, onConfirm, closeBtnText, onClose, onHide } = mergedProps

    return (
        <>
            <Modal
                size='lg'
                show={mode === 'loading' || mode === 'loaded' || mode === 'error'}
                className={className + ' mt-5 '}
                onHide={onHide}
            >
                <ModalHeader closeButton>
                    <div className="d-inline-block align-top logo-img-25x25 me-1" />
                    <Modal.Title>{header}</Modal.Title>
                </ModalHeader>
                <ModalBody>
                    {(mode === 'loading' || mode === 'error') &&
                        <div className='text-center'>
                            <Spinner color={mode === 'loading' ? 'primary' : 'danger'} style={{ height: '3rem', width: '3rem' }}></Spinner>
                            <h6 className={mode === 'loading' ? 'primary' : 'danger'}>
                                {mode === 'loading' && <>Загрузка...</>}
                                {mode === 'error' && <>Произошла ошибка</>}
                            </h6>
                        </div>
                    }
                    {mode === 'loaded' &&
                        children
                    }
                </ModalBody>
                <ModalFooter>
                    {onConfirm && <Button color="primary" disabled={mode === 'loading'} onClick={onConfirm}>{confirmBtnText}</Button>}
                    {onClose && <Button color="secondary" className='mx-3' onClick={onClose}>{closeBtnText}</Button>}
                </ModalFooter>
            </Modal>
        </>
    )
}