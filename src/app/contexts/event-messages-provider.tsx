import React, { createContext, PropsWithChildren } from 'react'
import EventMessage, { EventMessagePropsI } from '@components/event-message'
import EventMessagePropsFactory, { EventMessageTyepe } from '@utils/helpers/eventMessagePropsFactory'
import { EVENT_MESSAGES } from '@shared/consts'

type EventMessagesContextType = {
    addMessage: (t: EventMessageTyepe, hasError?: boolean, errorDescription?: string, additionalDescription?: string) => void,
}

export const EventMessagesContext = createContext<EventMessagesContextType>({} as EventMessagesContextType)

type EventMessagesProviderState = {
    eventMessagesProps: EventMessagePropsI[],
}

export class EventMessagesProvider extends React.Component<PropsWithChildren<{}>, EventMessagesProviderState> {
    timeRef: number | undefined = undefined

    constructor(props: PropsWithChildren) {
        super(props)

        this.state = {
            eventMessagesProps: [] as EventMessagePropsI[]
        }
    }

    componentWillUnmount(): void {
        const { eventMessagesProps } = this.state

        if (eventMessagesProps.length && this.timeRef) {
            window.clearInterval(this.timeRef)
            this.timeRef = undefined
        }
    }

    addMessage = (t: EventMessageTyepe, hasError?: boolean, errorDescription?: string, additionalDescription?: string) => {
        const props = EventMessagePropsFactory.getProps(t, this.onClose, hasError ?? false, errorDescription, additionalDescription)
        console.log('props', props)
        this.addPropsWithAutoClose(props)
    }

    addPropsWithAutoClose = (p: EventMessagePropsI) => {
        const { eventMessagesProps } = this.state
        if (eventMessagesProps.findIndex(el => el.elementiId === p.elementiId) >= 0) return;

        const isTimerWorking = eventMessagesProps.length > 0

        this.setState(prev => {
            return {
                ...prev,
                eventMessagesProps: [...prev.eventMessagesProps, p]
            }
        })

        if (isTimerWorking)
            return

        let arrayIsEmpty = false

        //таймер для авто закрытия событий
        this.timeRef = window.setInterval(() => {
            console.log('timer tic')

            this.setState(prev => {

                const { eventMessagesProps } = prev
                const newProps: EventMessagePropsI[] = []

                eventMessagesProps.forEach(el => {
                    const secAgo = el.secAgo + 1
                    const show = secAgo < EVENT_MESSAGES.VISIBLE_DELAY_IN_SEC

                    if (show) {
                        const newP = {
                            ...el,
                            secAgo: secAgo,
                            show: show
                        } as EventMessagePropsI

                        newProps.push(newP)
                    }
                })

                arrayIsEmpty = !newProps.length

                return {
                    ...prev,
                    eventMessagesProps: [...newProps]
                }
            })

            if (arrayIsEmpty) {
                window.clearInterval(this.timeRef)
                this.timeRef = undefined
            }
        }, 1000)
    }

    onClose = (elementiId: string, e?: React.MouseEvent | React.KeyboardEvent) => {
        e?.preventDefault()

        this.setState({
            ...this.state,
            eventMessagesProps: this.state.eventMessagesProps.filter(el => el.elementiId !== elementiId)
        })
    }

    render() {
        const { children } = this.props
        const { eventMessagesProps } = this.state
        const items: JSX.Element[] = []

        eventMessagesProps.forEach(p => {
            items.push(<EventMessage key={`event-message-${p.elementiId}`} {...p} />)
        })

        return (
            <>
                <div className='position-absolute mt-2 mx-2 z-index-20'>
                    {items}
                </div>
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