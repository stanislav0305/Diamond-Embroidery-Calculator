import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import { PictureDetailI, pictureDetailDefault } from '@shared/interfaces/pictureI'
import PictureDetailEdit from '@components/picture/picture-detail-edit'
import { genId } from '@utils/getData'


interface PicturDetailEditModalProps {
  onSaved: (forAdd: boolean, picture: PictureDetailI) => void,
}

interface PicturDetailEditModalState {
  mode: ModalMode,
  forAdd: boolean,
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
    pictureDetail.id = pictureDetail.id || genId()
    //this.toogle('loading', forAdd, picture)

    //сохроняем в базу данных
    console.log(JSON.stringify(pictureDetail, null, 2));

    this.toogle('closed')

    //обновляем таблицу
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
        <PictureDetailEdit data={pictureDetail}
          onSave={this.onSave}
          onClose={this.onClose}
        />
      </CustomModal >
    )
  }
}