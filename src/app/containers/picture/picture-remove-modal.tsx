import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import { EventMessagesContextType } from '@contexts/event-messages-context'


interface PictureRemoveModalProps {
    eventMessagesContext: EventMessagesContextType
    onRemoved: (id: string) => void
}

interface PictureRemoveModalState {
    mode: ModalMode
    id: string
}

export class PictureRemoveModal extends React.Component<PictureRemoveModalProps, PictureRemoveModalState> {
    constructor(props: PictureRemoveModalProps) {
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

    onConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const id = this.state.id

        this.toggle('loading')

        await window.api.pictures.delete(id)
            .then(removed => {
                const hasError = !removed
                this.props.eventMessagesContext.addMessage('PictureRemoved', hasError)
                this.toggle('closed')

                //update the table
                removed && this.props.onRemoved(id)
            })
            .catch(e => {
                this.props.eventMessagesContext.addMessage('PictureRemoved', true)
                this.toggle('error')
            })
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
            <CustomModal header='Удаление картины'
                mode={mode}
                confirmBtnText='Удалить'
                onConfirm={this.onConfirm}
                onClose={this.onClose}
                onHide={this.toggle}>
                <p>Вы действительно хотите удалить картину # {id}?</p>
            </CustomModal >
        )
    }
}