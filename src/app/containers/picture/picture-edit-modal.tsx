import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import { EventMessagesContext } from '@contexts/event-messages-provider'
import PictureI, { PictureDetailI, pictureDefault } from '@shared/interfaces/pictureI'
import PictureEdit from '@components/picture/picture-edit'
import { genId } from '@utils/getData'

interface PicturEditModalProps {
  onSaved: (forAdd: boolean, picture: PictureI) => void,
}

interface PicturEditModalState {
  mode: ModalMode,
  forAdd: boolean,
  picture: PictureI,
  details: PictureDetailI[]
}

export default class PicturEditModal extends React.Component<PicturEditModalProps, PicturEditModalState> {
  static contextType = EventMessagesContext
  context!: React.ContextType<typeof EventMessagesContext>

  constructor(props: PicturEditModalProps) {
    super(props)

    this.state = {
      mode: 'closed',
      forAdd: false,
      picture: pictureDefault,
      details: []
    }
  }

  onOpen = (picture: PictureI) => {
    const forAdd = !picture.id
    //this.toogle('loading', forAdd)
    this.toogle('loaded', forAdd, picture)
  }

  onClose = () => {
    this.toogle('closed')
  }

  onSave = (picture: PictureI) => {
    const forAdd = !picture.id
    const now = new Date().toLocaleString()
    const p = {
      ...picture,
      id: picture.id || genId(),
      created: forAdd ? now : picture.created,
      updated: !forAdd ? now : picture.updated,
    }

    //this.toogle('loading', forAdd, picture)

    //сохроняем в базу данных
    console.log(JSON.stringify(p, null, 2));

    this.toogle('closed')
    forAdd ? this.context.addMessage('PictureCreated') : this.context.addMessage('PictureUpdated')

    //обновляем таблицу
    this.props.onSaved(forAdd, p)
  }

  toogle = (mode: ModalMode = 'closed', forAdd: boolean = false, picture: PictureI | null = null) => {
    this.setState(prev => {
      return {
        ...prev,
        mode,
        forAdd,
        picture: picture ?? prev.picture
      }
    })
  }

  render() {
    const { mode, forAdd, picture } = this.state

    return (
      <CustomModal header={forAdd ? 'Добавление картины' : 'Редактирование картины'}
        mode={mode}
        onHide={this.toogle}>
        <PictureEdit data={picture}
          onSave={this.onSave}
          onClose={this.onClose}
        />
      </CustomModal >
    )
  }
}