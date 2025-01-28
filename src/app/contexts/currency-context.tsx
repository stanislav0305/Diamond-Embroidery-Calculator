import React, { createContext, PropsWithChildren } from 'react'
import { Subject, Subscription } from 'rxjs'
import { CurrencyI } from '@shared/interfaces/currencyI'
import { CurrencyNameHtmlCodesMap } from '@shared/types/currencyNameType'


export type CurrencyContextType = {
  currency: CurrencyI
  currencyHtmlCode: string
  setCurrency: (currency: CurrencyI) => void
  subscribeCurrencyChange: (callBack: (currency: CurrencyI) => void) => Subscription
}

export const CurrencyContext = createContext<CurrencyContextType>({} as CurrencyContextType)

//-------------------------------------------------------------------------

type CurrencyProviderState = {
  currency: CurrencyI
  isLoaded: boolean
}

export class CurrencyProvider extends React.Component<PropsWithChildren<{}>, CurrencyProviderState> {
  currencyChangeSubject = new Subject<CurrencyI>()

  constructor(props: PropsWithChildren) {
    super(props)

    this.state = {
      currency: {} as CurrencyI,
      isLoaded: false
    }
  }

  componentDidMount = () => {
    window.api.currency.getCurrent()
      .then(currency => {
        console.log('getCurrency', currency)

        this.setState(prev => {
          return {
            ...prev,
            currency,
            isLoaded: true
          }
        })
      })

    window.api.currency.on.currencyChanged((_event, currency: CurrencyI) => {
      console.log('currencyChanged in PicturesTable...')

      this.currencyChangeSubject.next(currency)
    })
  }

  componentWillUnmount(): void {
    window.api.currency.off.currencyChanged()
  }

  setCurrency = (currency: CurrencyI) => {
    window.api.currency.set(currency)
      .then(currency => {
        console.log('setCurrency', currency)

        this.setState({
          currency: currency,
          isLoaded: true
        })
      })
  }
  //---------------------------------------------

  subscribeCurrencyChange = (callBack: (currency: CurrencyI) => void): Subscription => {
    return this.currencyChangeSubject.subscribe(callBack)
  }

  //---------------------------------------------

  render() {
    const { children } = this.props
    const { currency, isLoaded } = this.state

    return (
      <>
        {!isLoaded &&
          <span>Loading ...</span>
        }
        {isLoaded &&
          <CurrencyContext.Provider
            value={{
              currency,
              currencyHtmlCode: CurrencyNameHtmlCodesMap.get(currency.name)!,
              setCurrency: this.setCurrency,
              subscribeCurrencyChange: this.subscribeCurrencyChange
            }}
          >
            {children}
          </CurrencyContext.Provider>
        }
      </>
    )
  }
}

//------------------------------------------------------------------------

export const CurrencyConsumer = CurrencyContext.Consumer