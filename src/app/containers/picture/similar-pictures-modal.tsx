import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import PicturesTable from '@containers/picture/pictures-table'
import SimilarPicturesFilterI from '@shared/classes/similarPicturesFilter'


interface StateI {
    mode: ModalMode,
    filter: SimilarPicturesFilterI
}

export default class SimilarPicturesModal extends React.Component<{}, StateI> {
    constructor(props: {}) {
        super(props)

        this.state = {
            mode: 'closed',
            filter: {} as SimilarPicturesFilterI
        }
    }

    onOpen = (filter: SimilarPicturesFilterI) => {
        this.toggle('loaded', filter)
    }

    onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.toggle('closed')
    }

    toggle = (mode: ModalMode = 'closed', filter: SimilarPicturesFilterI = {} as SimilarPicturesFilterI) => {
        this.setState(prev => {
            return {
                ...prev,
                mode,
                filter: mode === 'loaded' ? filter: mode === 'closed' ? {} as SimilarPicturesFilterI : prev.filter
            }
        })
    }

    render() {
        const { mode, filter } = this.state

        return (
            <CustomModal header='Похожие картины'
                mode={mode}
                onClose={this.onClose}
                onHide={this.toggle}>
                <PicturesTable componentMode='readonly' filter={filter} />
            </CustomModal >
        )
    }
}