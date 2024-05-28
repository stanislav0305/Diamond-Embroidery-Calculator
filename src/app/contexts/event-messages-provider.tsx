import React, { createContext, PropsWithChildren } from 'react'
import { interval, map, mergeMap, Subject, take, tap, takeWhile, switchMap } from 'rxjs'
import EventMessage, { EventMessagePropsI } from '@components/event-message'
import EventMessagePropsFactory, { EventMessageTyepe } from '@utils/helpers/eventMessagePropsFactory'
import { EVENT_MESSAGES } from '@shared/consts'
import IdHelper from '@shared/helpers/idHelper'


type EventMessagesContextType = {
    addMessage: (t: EventMessageTyepe, hasError?: boolean, errorDescription?: string, additionalDescription?: string) => void,
}

export const EventMessagesContext = createContext<EventMessagesContextType>({} as EventMessagesContextType)

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
                        map(() => { return Object.keys(this.emp).length }),
                        takeWhile(Boolean),
                    )),
                tap(t => {
                    console.log(`Render tick t=${t}`)
                    const arr = Object.values(this.emp) as EventMessagePropsI[]
                    this.setState(prev => {
                        return {
                            ...prev,
                            eventMessagesProps: [...arr]
                        }
                    })
                })
            )
            .subscribe()


        this.addMessageSubject
            .pipe(
                map(p => {
                    const key = IdHelper.genId()
                    this.emp[key] = { ...p } as EventMessagePropsI
                    this.renderTimerSubject.next(true)

                    return key
                }),
                mergeMap((key: string, index: number) => {
                    return interval(1000).pipe(
                        take(EVENT_MESSAGES.VISIBLE_DELAY_IN_SEC),
                        map(t => {
                            console.log(`Change timer t=${t} index=${index}, for key=${key}`)
                            this.emp[key].secAgo++
                            this.emp[key].show = this.emp[key].secAgo < EVENT_MESSAGES.VISIBLE_DELAY_IN_SEC

                            return key
                        }),
                        map(key => {
                            if (!this.emp[key].show) {
                                delete this.emp[key]
                                console.log(`Property by key=${key} deleted`)
                            }

                            return key
                        })
                    )
                }),
            )
            .subscribe()

    }

    componentWillUnmount(): void {
        this.addMessageSubject.unsubscribe()
        this.renderTimerSubject.unsubscribe()
    }


    addMessage = (t: EventMessageTyepe, hasError?: boolean, errorDescription?: string, additionalDescription?: string) => {
        const props = EventMessagePropsFactory.getProps(t, this.onClose, hasError ?? false, errorDescription, additionalDescription)
        this.addMessageSubject.next(props)
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