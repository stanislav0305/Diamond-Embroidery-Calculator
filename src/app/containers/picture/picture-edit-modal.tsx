import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import { EventMessagesContext } from '@contexts/event-messages-provider'
import PictureI, { pictureDefault } from '@shared/interfaces/pictureI'
import PictureDetailI from '@shared/interfaces/pictureDetailI'
import PictureEdit from '@components/picture/picture-edit'
import { AppSettingsContext } from '@contexts/app-settings-context-provider'
import ProcessingResultI from '@shared/interfaces/processingResultI'


interface PicturEditModalProps {
  onSaved: (forAdd: boolean, picture: PictureI) => void
}

interface PicturEditModalState {
  mode: ModalMode
  forAdd: boolean
  picture: PictureI
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

  componentDidMount() {
    window.api.pictures.images.on.loaded((_event, info: ProcessingResultI) => {
      const hasError = info.notProcessed > 0
      if (hasError) {
        console.error(`pictureFilesLoaded: Not all images loaded! Sended file count:${info.sended}, not loaded count ${info.notProcessed}`)
      }

      const description = `Изображений: отправлено: ${info.sended}, не сохранено: ${info.notProcessed}, сохранено: ${info.done}`
      this.context.addMessage(
        'PictureFilesLoaded',
        hasError,
        description,
        description
      )
    })

    window.api.pictures.images.on.removed((_event, info: ProcessingResultI) => {
      const hasError = info.notProcessed > 0
      if (hasError) {
        console.error(`pictureFilesRemoved: Not all images removed! Sended file count:${info.sended}, not loaded count ${info.notProcessed}`)
      }

      const description = `Изображений: отправлено: ${info.sended}, не удалено: ${info.notProcessed}, удалено: ${info.done}`
      this.context.addMessage(
        'PictureFilesRemoved',
        hasError,
        description,
        description
      )
    })
  }

  componentWillUnmount = () => {
    window.api.pictures.images.off.loaded()
    window.api.pictures.images.off.removed()
  }

  onOpen = (picture: PictureI) => {
    const forAdd = !picture.id
    this.toogle('loaded', forAdd, picture)
  }

  onClose = () => {
    this.toogle('closed')
  }

  onSave = async (picture: PictureI) => {
    const forAdd = !picture.id

    const p = {
      ...picture,
      images: [...picture.images]
    } as PictureI

    console.log('sended picture:', JSON.stringify(p, null, 2))
    this.toogle('loading', forAdd, picture)
    
    if (forAdd) {
      await window.api.pictures.create(p)
        .then(pp => {
          const hasError = !pp
          this.context.addMessage('PictureCreated', hasError)
          this.toogle('closed')

          //update the table
          pp && this.props.onSaved(forAdd, pp)
        })
        .catch(e => {
          this.context.addMessage('PictureCreated', true)
          this.toogle('error', forAdd, picture)
        })

    } else {
      await window.api.pictures.update(p)
        .then(pp => {
          const hasError = !pp
          this.context.addMessage('PictureUpdated', hasError)
          this.toogle('closed')

          //update the table
          pp && this.props.onSaved(forAdd, pp)
        })
        .catch(e => {
          this.context.addMessage('PictureUpdated', true)
          this.toogle('error', forAdd, picture)
        })
    }
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
        <AppSettingsContext.Consumer>
          {(appSettingsContext) => (
            <PictureEdit data={picture}
              pictureImagesPath={appSettingsContext.appSettings.paths.pictureImagesPath}
              onSave={this.onSave}
              onClose={this.onClose}
            />
          )}
        </AppSettingsContext.Consumer>
      </CustomModal >
    )
  }
}