import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import PicturesDefaultSetI, { picturesDefaultSetDefault } from '@shared/interfaces/picturesDefaultSetI'
import PictureDefaultSetEdit from '@components/picture/picture-default-set-edit'
import { EventMessagesContextType } from '@contexts/event-messages-context'
import { CurrencyConsumer } from '@contexts/currency-context'
import { PicturesDefaultSetContextType } from '@contexts/pictures-default-set-context'


interface PropsI {
    eventMessagesContext: EventMessagesContextType
    picturesDefaultSetContext: PicturesDefaultSetContextType
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
        this.toggle('loaded', this.props.picturesDefaultSetContext.defaultSet)
    }

    onClose = () => {
        this.toggle('closed')
    }

    onSave = async (formData: PicturesDefaultSetI) => {

        const model = { ...formData } as PicturesDefaultSetI

        console.log('sended to save:', JSON.stringify(model, null, 2))
        this.toggle('loading', model)

        await this.props.picturesDefaultSetContext.setPicturesDefaultSet(model)
            .then(defaultSet => {
                this.toggle('closed')
            })
            .catch(e => {
                this.toggle('error', model)
            })
    }

    toggle = (mode: ModalMode = 'closed', model: PicturesDefaultSetI | null = null) => {
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
                onHide={this.toggle}>
                <CurrencyConsumer>
                    {currencyContext =>
                        <PictureDefaultSetEdit
                            currencyContext={currencyContext}
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