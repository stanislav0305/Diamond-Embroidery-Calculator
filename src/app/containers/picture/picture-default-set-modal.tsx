import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import PicturesDefaultSetI, { picturesDefaultSetDefault } from '@shared/interfaces/picturesDefaultSetI'
import PictureDefaultSetEdit from '@components/picture/picture-default-set-edit'
import { EventMessagesContext } from '@contexts/event-messages-provider'


interface State {
    mode: ModalMode,
    model: PicturesDefaultSetI
}

export default class PictureDefaultSetModal extends React.Component<{}, State> {
    static contextType = EventMessagesContext
    context!: React.ContextType<typeof EventMessagesContext>

    constructor(props: {}) {
        super(props)

        this.state = {
            mode: 'closed',
            model: picturesDefaultSetDefault
        }
    }

    onOpen = () => {
        this.toogle('loading')
        window.api.picturesDefaultSet.get()
            .then((data: PicturesDefaultSetI) => {
                !data ? this.toogle('error') : this.toogle('loaded', data)
            })
            .catch(e => {
                console.error(e)
                this.toogle('error')
            })
    }

    onClose = () => {
        this.toogle('closed')
    }

    onSave = async (formData: PicturesDefaultSetI) => {

        const model = { ...formData } as PicturesDefaultSetI

        console.log('sended to save:', JSON.stringify(model, null, 2));
        this.toogle('loading', model)

        await window.api.picturesDefaultSet.set(model)
            .then(newModel => {
                const hasError = !newModel
                this.context.addMessage('PicturesDefaultSetSaved', hasError)
                this.toogle('closed')
            })
            .catch(e => {
                this.context.addMessage('PicturesDefaultSetSaved', true)
                this.toogle('error', model)
            })
    }

    toogle = (mode: ModalMode = 'closed', model: PicturesDefaultSetI | null = null) => {
        this.setState(prev => {
            return {
                ...prev,
                mode,
                model: model || prev.model
            }
        })
    }

    render() {
        const { mode, model } = this.state
        return (
            <CustomModal header="Данные по умолчанию"
                mode={mode}
                onHide={this.toogle}>
                <PictureDefaultSetEdit data={model}
                    onSave={this.onSave}
                    onClose={this.onClose}
                />
            </CustomModal >
        )
    }
}