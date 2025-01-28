import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'


interface PictureDetailRemoveModalProps {
    onRemoved: (id: string) => void
}

interface PictureDetailRemoveModalState {
    mode: ModalMode
    id: string
}

export default class PictureDetailRemoveModal extends React.Component<PictureDetailRemoveModalProps, PictureDetailRemoveModalState> {
    constructor(props: PictureDetailRemoveModalProps) {
        super(props)

        this.state = {
            mode: 'closed',
            id: '',
        }
    }

    onOpen = (id: string) => {
        this.toggle('loaded', id)
    }

    onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.toggle('closed')
    }

    onConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const id = this.state.id

        this.toggle('closed')
        this.props.onRemoved(id)
    }

    toggle = (mode: ModalMode = 'closed', id?: string) => {
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
                onHide={this.toggle}>
                <p>Вы действительно хотите удалить материал картины # {id}?</p>
            </CustomModal >
        )
    }
}