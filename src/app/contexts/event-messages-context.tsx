import React, { createContext, PropsWithChildren } from 'react'
import { interval, map, mergeMap, Subject, tap, takeWhile, switchMap } from 'rxjs'
import EventMessage, { EventMessagePropsI } from '@components/event-message'
import EventMessagePropsFactory, { EventMessageType } from '@utils/helpers/eventMessagePropsFactory'
import { EVENT_MESSAGES } from '@shared/consts'
import ProcessingResultI from '@shared/interfaces/processingResultI'
import { ToastContainer } from 'react-bootstrap'


export type EventMessagesContextType = {
    addMessage: (t: EventMessageType, hasError?: boolean, errorDescription?: string, additionalDescription?: string) => void,
}

const EventMessagesContext = createContext<EventMessagesContextType>({} as EventMessagesContextType)

//-----------------------------------------------------------------------

type EventMessagesProviderState = {
    eventMessagesProps: EventMessagePropsI[]
}

export class EventMessagesProvider extends React.Component<PropsWithChildren<{}>, EventMessagesProviderState> {
    addMessageSubject = new Subject<EventMessagePropsI>()
    renderTimerSubject = new Subject<Boolean>
    emp = {} as { [key: string]: EventMessagePropsI }


    constructor(props: PropsWithChildren) {
        super(props)

        this.state = {
            eventMessagesProps: [] as EventMessagePropsI[]
        }

        this.renderTimerSubject
            .pipe(
                switchMap(() => interval(1000)
                    .pipe(
                        takeWhile(t => Object.keys(this.emp).length > 0
                            || this.state.eventMessagesProps.length > 0
                        ),
                    )),
                tap(t => {
                    console.log(`Render tick t=${t}`)
                    const arr = Object.values(this.emp) as EventMessagePropsI[]
                    this.setState(prev => {
                        return {
                            ...prev,
                            eventMessagesProps: [...arr],
                        }
                    })
                })
            )
            .subscribe()

        this.addMessageSubject
            .pipe(
                map(p => {
                    this.emp[p.id] = { ...p } as EventMessagePropsI
                    this.renderTimerSubject.next(true)

                    return p.id
                }),
                mergeMap((id: string, index: number) => {
                    return interval(1000).pipe(
                        takeWhile(t => t <= EVENT_MESSAGES.VISIBLE_DELAY_IN_SEC && !!this.emp[id]),
                        map(t => {
                            console.log(`Change timer t=${t} index=${index}, for key=${id}`)
                            this.emp[id].secAgo++

                            return id
                        }),
                        map(id => {
                            if ((this.emp[id].secAgo === EVENT_MESSAGES.VISIBLE_DELAY_IN_SEC + 1)
                                || (!this.emp[id].show)) {
                                delete this.emp[id]
                                console.log(`Property by key=${id} deleted`)
                            }

                            return id
                        })
                    )
                }),
            )
            .subscribe()


        window.api.pictures.images.on.downloaded((_event, result: boolean) => {
            const hasError = !result
            this.addMessage(
                'PictureFilesDownloaded',
                hasError
            )
        })

        window.api.pictures.images.on.loaded((_event, info: ProcessingResultI) => {
            const hasError = info.notProcessed > 0
            if (hasError) {
                console.error(`pictureFilesLoaded: Not all images loaded! Sended file count:${info.sended}, not loaded count ${info.notProcessed}`)
            }

            const description = `Изображений: отправлено: ${info.sended}, не сохранено: ${info.notProcessed}, сохранено: ${info.done}`
            this.addMessage(
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
            this.addMessage(
                'PictureFilesRemoved',
                hasError,
                description,
                description
            )
        })
    }

    componentWillUnmount(): void {
        window.api.pictures.images.off.loaded()
        window.api.pictures.images.off.downloaded()
        window.api.pictures.images.off.removed()

        this.addMessageSubject.unsubscribe()
        this.renderTimerSubject.unsubscribe()
    }


    addMessage = (t: EventMessageType, hasError?: boolean, errorDescription?: string, additionalDescription?: string) => {
        const props = EventMessagePropsFactory.getProps(t, this.onClose, hasError ?? false, errorDescription, additionalDescription)
        this.addMessageSubject.next(props)
    }

    onClose = (key: string, e?: React.MouseEvent | React.KeyboardEvent) => {
        e?.preventDefault()

        this.emp[key].show = false
    }

    render() {
        const { children } = this.props
        const { eventMessagesProps } = this.state
        const items: JSX.Element[] = []

        eventMessagesProps.forEach(p => {
            items.push(<EventMessage key={`event-message-${p.id}`} {...p} />)
        })

        return (
            <>
                <ToastContainer
                    position="bottom-end"
                    className='mb-5 mx-2 z-index-20'
                >
                    {items}
                </ToastContainer>
                <EventMessagesContext.Provider
                    value={{
                        addMessage: this.addMessage
                    }}
                >
                    {children}
                </EventMessagesContext.Provider>
            </>
        )
    }
}

//-----------------------------------------------------------------------

export const EventMessageConsumer = EventMessagesContext.Consumer