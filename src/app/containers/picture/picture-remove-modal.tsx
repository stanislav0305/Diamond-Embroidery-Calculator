import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import { EventMessagesContextType } from '@contexts/event-messages-context'


interface PicturRemoveModalProps {
    eventMessagesContext: EventMessagesContextType
    onRemoved: (id: string) => void
}

interface PicturRemoveModalState {
    mode: ModalMode
    id: string
}

export class PicturRemoveModal extends React.Component<PicturRemoveModalProps, PicturRemoveModalState> {
    constructor(props: PicturRemoveModalProps) {
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

    onConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const id = this.state.id

        this.toogle('loading')

        await window.api.pictures.delete(id)
            .then(removed => {
                const hasError = !removed
                this.props.eventMessagesContext.addMessage('PictureRemoved', hasError)
                this.toogle('closed')

                //update the table
                removed && this.props.onRemoved(id)
            })
            .catch(e => {
                this.props.eventMessagesContext.addMessage('PictureRemoved', true)
                this.toogle('error')
            })
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
            <CustomModal header='Удаление картины'
                mode={mode}
                confirmBtnText='Удалить'
                onConfirm={this.onConfirm}
                onClose={this.onClose}
                onHide={this.toogle}>
                <p>Вы действительно хотите удалить картину # {id}?</p>
            </CustomModal >
        )
    }
}