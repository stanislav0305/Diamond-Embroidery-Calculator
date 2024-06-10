import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import PicturesDefaultSetI, { picturesDefaultSetDefault } from '@shared/interfaces/picturesDefaultSetI'
import PictureDefaultSetEdit from '@components/picture/picture-default-set-edit'
import { EventMessagesContextType } from '@contexts/event-messages-context'
import { CurrencyConsumer } from '@contexts/currency-context'


interface PropsI {
    eventMessagesContext: EventMessagesContextType
}

interface StateI {
    mode: ModalMode
    model: PicturesDefaultSetI
}

export default class PictureDefaultSetModal extends React.Component<PropsI, StateI> {
    constructor(props: PropsI) {
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

        console.log('sended to save:', JSON.stringify(model, null, 2))
        this.toogle('loading', model)

        await window.api.picturesDefaultSet.set(model)
            .then(newModel => {
                const hasError = !newModel
                this.props.eventMessagesContext.addMessage('PicturesDefaultSetSaved', hasError)
                this.toogle('closed')
            })
            .catch(e => {
                this.props.eventMessagesContext.addMessage('PicturesDefaultSetSaved', true)
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
                <CurrencyConsumer>
                    {context =>
                        <PictureDefaultSetEdit
                            currencyContext={context}
                            data={model}
                            onSave={this.onSave}
                            onClose={this.onClose}
                        />
                    }
                </CurrencyConsumer>
            </CustomModal >
        )
    }
}