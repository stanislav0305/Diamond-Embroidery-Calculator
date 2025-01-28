import React, { createContext, PropsWithChildren } from 'react'
import { Subject, Subscription } from 'rxjs'
import PicturesDefaultSetI from '@shared/interfaces/picturesDefaultSetI'
import { EventMessagesContextType } from '@contexts/event-messages-context'


export type PicturesDefaultSetContextType = {
    defaultSet: PicturesDefaultSetI
    setPicturesDefaultSet: (defaultSet: PicturesDefaultSetI) => Promise<PicturesDefaultSetI>
    subscribePicturesDefaultSetChange: (callBack: (defaultSet: PicturesDefaultSetI) => void) => Subscription
}

export const PicturesDefaultSetContext = createContext<PicturesDefaultSetContextType>({} as PicturesDefaultSetContextType)

//-------------------------------------------------------------------------

type ProviderProps = {
    eventMessagesContext: EventMessagesContextType
}

type ProviderState = {
    defaultSet: PicturesDefaultSetI
    isLoaded: boolean
}

export class PicturesDefaultSetProvider extends React.Component<PropsWithChildren<ProviderProps>, ProviderState> {
    picturesDefaultSetChangeSubject = new Subject<PicturesDefaultSetI>()

    constructor(props: PropsWithChildren<ProviderProps>) {
        super(props)

        this.state = {
            defaultSet: {} as PicturesDefaultSetI,
            isLoaded: false
        }
    }

    componentDidMount = () => {
        window.api.picturesDefaultSet.get()
            .then(defaultSet => {
                console.log('getPicturesDefaultSet...')

                this.setState(prev => {
                    return {
                        ...prev,
                        defaultSet,
                        isLoaded: true
                    }
                })
            })
            .catch(e => {
                console.error('Error in getPicturesDefaultSet.', e)
            })

        window.api.picturesDefaultSet.on.defaultSetChanged((_event, defaultSet: PicturesDefaultSetI) => {
            console.log('PicturesDefaultSet Changed...')

            this.picturesDefaultSetChangeSubject.next(defaultSet)
        })
    }

    componentWillUnmount(): void {
        window.api.picturesDefaultSet.off.defaultSetChanged()
    }

    setPicturesDefaultSet = (defaultSet: PicturesDefaultSetI) => {
        return window.api.picturesDefaultSet.set(defaultSet)
            .then(defaultSet => {
                console.log('setPicturesDefaultSet...')

                const hasError = !defaultSet
                this.props.eventMessagesContext.addMessage('PicturesDefaultSetSaved', hasError)

                this.setState({
                    defaultSet,
                    isLoaded: true
                })

                return defaultSet
            })
            .catch(e => {
                console.error('Error in setPicturesDefaultSet.', e)
                this.props.eventMessagesContext.addMessage('PicturesDefaultSetSaved', true)

                throw e
            })
    }
    //---------------------------------------------
    subscribePicturesDefaultSetChange = (callBack: (defaultSet: PicturesDefaultSetI) => void): Subscription => {
        return this.picturesDefaultSetChangeSubject.subscribe(callBack)
    }

    //---------------------------------------------

    render() {
        const { children } = this.props
        const { defaultSet, isLoaded } = this.state

        return (
            <>
                {!isLoaded &&
                    <span>Loading ...</span>
                }
                {isLoaded &&
                    <PicturesDefaultSetContext.Provider
                        value={{
                            defaultSet,
                            setPicturesDefaultSet: this.setPicturesDefaultSet,
                            subscribePicturesDefaultSetChange: this.subscribePicturesDefaultSetChange
                        }}
                    >
                        {children}
                    </PicturesDefaultSetContext.Provider>
                }
            </>
        )
    }
}

//------------------------------------------------------------------------

export const PicturesDefaultSetConsumer = PicturesDefaultSetContext.Consumer