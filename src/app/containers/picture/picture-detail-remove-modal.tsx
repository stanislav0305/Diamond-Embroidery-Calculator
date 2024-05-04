import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'


interface PicturDetailRemoveModalProps {
    onRemoved: (id: string) => void,
}

interface PicturDetailRemoveModalState {
    mode: ModalMode,
    id: string,
}

export default class PicturRemoveModal extends React.Component<PicturDetailRemoveModalProps, PicturDetailRemoveModalState> {
    constructor(props: PicturDetailRemoveModalProps) {
        super(props)

        this.state = {
            mode: 'closed',
            id: '',
        }
    }

    onOpen = (id: string) => {
        this.toogle('loaded', id)
    }

    onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.toogle('closed')
    }

    onConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const id = this.state.id

        this.toogle('closed')
        this.props.onRemoved(id)
    }

    toogle = (mode: ModalMode = 'closed', id?: string) => {
        this.setState(prev => {
            return {
                ...prev,
                mode,
                id: id ?? prev.id,
            }
        })
    }

    render() {
        const { mode, id } = this.state

        return (
            <CustomModal header='Удаление материала картины'
                mode={mode}
                confirmBtnText='Удалить'
                onConfirm={this.onConfirm}
                onClose={this.onClose}
                onHide={this.toogle}>
                <p>Вы действительно хотите удалить материал картины # {id}?</p>
            </CustomModal >
        )
    }
}