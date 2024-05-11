import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import PictureDetailI from '@shared/interfaces/pictureDetailI'
import { getPictureDetailsDefaultSetDate } from '@utils/getData'
import PicturesDetailsTable from '@containers/picture/picture-details-table'
import { InputGroup } from 'react-bootstrap'

interface State {
    mode: ModalMode,
    pictureDetailsDefaultSet: PictureDetailI[],
    pictureDetailsDefaultSetSum: number
}

export default class PicturDetailsTableModal extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        const pd = getPictureDetailsDefaultSetDate(10)
        const sum = pd.reduce((sum, item) => sum + item.price, 0)
        this.state = {
            mode: 'closed',
            pictureDetailsDefaultSet: pd,
            pictureDetailsDefaultSetSum: sum
        }
    }

    onOpen = () => {
        this.toogle('loaded')
    }

    onClose = () => {
        this.toogle('closed')
    }

    toogle = (mode: ModalMode = 'closed') => {
        this.setState(prev => {
            return {
                ...prev,
                mode
            }
        })
    }

    onSavedPictureDetail = (forAdd: boolean, pictureDetail: PictureDetailI) => {
        console.info('onSavedPictureDetail !')
        const { pictureDetailsDefaultSet } = this.state
        const pds = forAdd ? pictureDetailsDefaultSet : pictureDetailsDefaultSet.filter(item => item.id !== pictureDetail.id)
        const sum = pds.reduce((sum, item) => sum + item.price, 0) + pictureDetail.price
        //сохраняем строку в бызу данных...

        this.setState(prev => {
            return {
                ...prev,
                pictureDetailsDefaultSet: [...pds, pictureDetail],
                pictureDetailsDefaultSetSum: sum
            }
        })


    }

    onRemovedPictureDetail = (id: string) => {
        console.info('onRemovedPictureDetail !')
        const { pictureDetailsDefaultSet, pictureDetailsDefaultSetSum } = this.state
        const pd = pictureDetailsDefaultSet.find(item => item.id === id)
        const sum = pd ? pictureDetailsDefaultSetSum - pd.price : pictureDetailsDefaultSetSum
        const pds = pictureDetailsDefaultSet.filter(item => item.id !== id)

        //удаляем строку из бызы данных...

        this.setState(prev => {
            return {
                ...prev,
                pictureDetailsDefaultSet: pds,
                pictureDetailsDefaultSetSum: sum
            }
        })
    }

    render() {
        const { mode, pictureDetailsDefaultSet, pictureDetailsDefaultSetSum } = this.state

        return (
            <CustomModal header="Материалы по умолчанию"
                mode={mode}
                onHide={this.toogle}>
                <PicturesDetailsTable
                    pictureDetails={pictureDetailsDefaultSet}
                    onSavedPictureDetail={this.onSavedPictureDetail}
                    onRemovedPictureDetail={this.onRemovedPictureDetail}
                />
                <InputGroup size="sm" className="mt-1 fw-bold">
                    <InputGroup.Text className="p-1">
                        Всего за материалы(по умолчанию)
                    </InputGroup.Text>
                    <InputGroup.Text className="p-1">
                        {pictureDetailsDefaultSetSum}
                    </InputGroup.Text>
                    <InputGroup.Text className='p-1'>
                        <i className="bi bi-currency-euro"></i>
                    </InputGroup.Text>
                </InputGroup>
            </CustomModal >
        )
    }
}