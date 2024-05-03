import React from 'react'
import { EventMessagesContext } from '@contexts/event-messages-provider'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'


interface PicturRemoveModalProps {
    onRemoved: (id: number) => void,
}

interface PicturRemoveModalState {
    mode: ModalMode,
    id: number,
}

export default class PicturRemoveModal extends React.Component<PicturRemoveModalProps, PicturRemoveModalState> {
    static contextType = EventMessagesContext
    context!: React.ContextType<typeof EventMessagesContext>

    constructor(props: PicturRemoveModalProps) {
        super(props)

        this.state = {
            mode: 'closed',
            id: 0,
        }
    }

    onOpen = (id: number) => {
        this.toogle('loaded', id)
    }

    onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.toogle('closed')
    }

    onConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const id = this.state.id

        //удаление из базы данных
        //...

        this.toogle('closed')
        this.context.addMessage('PictureRemoved')
        this.props.onRemoved(id)
    }

    toogle = (mode: ModalMode = 'closed', id?: number) => {
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