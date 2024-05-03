import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import { EventMessagesContext } from '@contexts/event-messages-provider'
import PictureI from '@shared/interfaces/pictureI'
import PictureEdit from '@components/picture-edit'
import { createPicture } from '@utils/getData'

interface PicturEditModalProps {
  onSaved: (forAdd: boolean, picture: PictureI) => void,
}

interface PicturEditModalState {
  mode: ModalMode,
  forAdd: boolean,
  picture: PictureI | null
}

export default class PicturEditModal extends React.Component<PicturEditModalProps, PicturEditModalState> {
  static contextType = EventMessagesContext
  context!: React.ContextType<typeof EventMessagesContext>


  constructor(props: PicturEditModalProps) {
    super(props)

    this.state = {
      mode: 'closed',
      forAdd: false,
      picture: null,
    }
  }
  
  onOpen = (id: number) => {
    const forAdd = !id
    this.toogle('loading', forAdd)

    if (forAdd) {
      this.toogle('loaded', forAdd)
    }
    else {
      const picture = createPicture(id) //data.find(item => item.id === id)
      this.toogle('loaded', forAdd, picture)
    }
  }

  onClose = () => {
    this.toogle('closed')
  }

  onSave = (picture: PictureI) => {
    const forAdd = !picture.id
    //this.toogle('loading', forAdd, picture)

    //сохроняем в базу данных
    console.log(JSON.stringify(picture, null, 2));

    this.toogle('closed')
    forAdd ? this.context.addMessage('PictureCreated') : this.context.addMessage('PictureUpdated')

    //обновляем таблицу
    this.props.onSaved(forAdd, picture)
  }

  toogle = (mode: ModalMode = 'closed', forAdd: boolean = false, picture: PictureI | null = null) => {
    this.setState(prev => {
      return {
        ...prev,
        mode,
        forAdd,
        picture
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
