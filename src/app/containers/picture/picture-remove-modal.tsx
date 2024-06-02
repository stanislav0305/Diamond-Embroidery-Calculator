import React from 'react'
import { EventMessagesContext } from '@contexts/event-messages-provider'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'


interface PicturRemoveModalProps {
    onRemoved: (id: string) => void
}

interface PicturRemoveModalState {
    mode: ModalMode
    id: string
}

export default class PicturRemoveModal extends React.Component<PicturRemoveModalProps, PicturRemoveModalState> {
    static contextType = EventMessagesContext
    context!: React.ContextType<typeof EventMessagesContext>

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
                this.context.addMessage('PictureRemoved', hasError)
                this.toogle('closed')

                //update the table
                removed && this.props.onRemoved(id)
            })
            .catch(e => {
                this.context.addMessage('PictureRemoved', true)
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