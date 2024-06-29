import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import { EventMessagesContextType } from '@contexts/event-messages-context'
import PictureI, { pictureDefault } from '@shared/interfaces/pictureI'
import PictureDetailI from '@shared/interfaces/pictureDetailI'
import PictureEdit from '@components/picture/picture-edit'
import { ComponentModeType } from '@utils/types/componentModeType'
import { AppSettingsConsumer } from '@contexts/app-settings-context'
import { CurrencyConsumer } from '@contexts/currency-context'
import { PicturesDefaultSetConsumer } from '@contexts/pictures-default-set-context'


interface PicturEditModalProps {
  eventMessagesContext: EventMessagesContextType
  componentMode?: ComponentModeType
  onSaved: (forAdd: boolean, picture: PictureI) => void
}

interface PicturEditModalState {
  mode: ModalMode
  forAdd: boolean
  picture: PictureI
  pricePerHourAutoCorrect: boolean
  details: PictureDetailI[]
}

export default class PicturEditModal extends React.Component<PicturEditModalProps, PicturEditModalState> {
  static defaultProps = {
    componentMode: 'default',
  }

  constructor(props: PicturEditModalProps) {
    super(props)

    this.state = {
      mode: 'closed',
      forAdd: false,
      picture: pictureDefault,
      pricePerHourAutoCorrect: false,
      details: []
    }
  }

  onOpen = (picture: PictureI, pricePerHourAutoCorrect: boolean) => {
    const forAdd = !picture.id
    this.toogle('loaded', forAdd, picture, pricePerHourAutoCorrect)
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
          this.props.eventMessagesContext.addMessage('PictureCreated', hasError)
          this.toogle('closed')

          //update the table
          pp && this.props.onSaved(forAdd, pp)
        })
        .catch(e => {
          this.props.eventMessagesContext.addMessage('PictureCreated', true)
          this.toogle('error', forAdd, picture)
        })

    } else {
      await window.api.pictures.update(p)
        .then(pp => {
          const hasError = !pp
          this.props.eventMessagesContext.addMessage('PictureUpdated', hasError)
          this.toogle('closed')

          //update the table
          pp && this.props.onSaved(forAdd, pp)
        })
        .catch(e => {
          this.props.eventMessagesContext.addMessage('PictureUpdated', true)
          this.toogle('error', forAdd, picture)
        })
    }
  }

  toogle = (mode: ModalMode = 'closed', forAdd: boolean = false, picture: PictureI | null = null,
    pricePerHourAutoCorrect: boolean | null = null) => {
    this.setState(prev => {
      return {
        ...prev,
        mode,
        forAdd,
        picture: picture ?? prev.picture,
        pricePerHourAutoCorrect: pricePerHourAutoCorrect ?? prev.pricePerHourAutoCorrect,
      }
    })
  }

  render() {
    const { componentMode, eventMessagesContext } = this.props
    const { mode, forAdd, picture } = this.state

    return (
      <CustomModal header={componentMode === 'default' ? (forAdd ? 'Добавление картины' : 'Редактирование картины') : 'Данные картины'}
        mode={mode}
        onHide={this.toogle}
      >
        <CurrencyConsumer>
          {currencyContext =>
            <AppSettingsConsumer>
              {appSettingsContext =>
                <PicturesDefaultSetConsumer>
                  {picturesDefaultSetContext =>

                    <PictureEdit
                      currencyContext={currencyContext}
                      appSettingsContext={appSettingsContext}
                      picturesDefaultSetContext={picturesDefaultSetContext}
                      eventMessagesContext={eventMessagesContext}
                      componentMode={componentMode}
                      data={picture}
                      onSave={this.onSave}
                      onClose={this.onClose}
                    />

                  }
                </PicturesDefaultSetConsumer>
              }
            </AppSettingsConsumer>
          }
        </CurrencyConsumer>
      </CustomModal >
    )
  }
}