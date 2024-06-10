import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import PictureDetailI, { pictureDetailDefault } from '@shared/interfaces/pictureDetailI'
import PictureDetailEdit from '@components/picture/picture-detail-edit'
import IdHelper from '@shared/helpers/idHelper'
import { CurrencyConsumer } from '@contexts/currency-context'


interface PicturDetailEditModalProps {
  onSaved: (forAdd: boolean, picture: PictureDetailI) => void
}

interface PicturDetailEditModalState {
  mode: ModalMode
  forAdd: boolean
  pictureDetail: PictureDetailI
}

export default class PicturDetailEditModal extends React.Component<PicturDetailEditModalProps, PicturDetailEditModalState> {
  constructor(props: PicturDetailEditModalProps) {
    super(props)

    this.state = {
      mode: 'closed',
      forAdd: false,
      pictureDetail: pictureDetailDefault,
    }
  }

  onOpen = (pictureDetail: PictureDetailI) => {
    const forAdd = !pictureDetail.id
    this.toogle('loaded', forAdd, pictureDetail)
  }

  onClose = () => {
    this.toogle('closed')
  }

  onSave = (pictureDetail: PictureDetailI) => {
    const forAdd = !pictureDetail.id
    pictureDetail.id = pictureDetail.id || IdHelper.genId()

    console.log(JSON.stringify(pictureDetail, null, 2))

    this.toogle('closed')

    //save and update the table
    this.props.onSaved(forAdd, pictureDetail)
  }

  toogle = (mode: ModalMode = 'closed', forAdd: boolean = false, pictureDetail: PictureDetailI | null = null) => {
    this.setState(prev => {
      return {
        ...prev,
        mode,
        forAdd,
        pictureDetail: pictureDetail ?? prev.pictureDetail,
      }
    })
  }

  render() {
    const { mode, forAdd, pictureDetail } = this.state

    return (
      <CustomModal header={forAdd ? 'Добавление материала картины' : 'Редактирование материала картины'}
        mode={mode}
        onHide={this.toogle}>
        <CurrencyConsumer>
          {context =>
            <PictureDetailEdit
              currencyContext={context}
              data={pictureDetail}
              onSave={this.onSave}
              onClose={this.onClose}
            />
          }
        </CurrencyConsumer>
      </CustomModal >
    )
  }
}