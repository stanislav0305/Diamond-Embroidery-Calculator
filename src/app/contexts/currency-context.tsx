import React, { createContext, PropsWithChildren } from 'react'
import { CurrencyI } from '@shared/interfaces/currencyI'
import { CurrencyNameHtmlCodesMap } from '@shared/types/currencyNameType'


export type CurrencyContextType = {
  currency: CurrencyI
  currencyHtmlCode: string
  setCurrency: (currency: CurrencyI) => void
}

export const CurrencyContext = createContext<CurrencyContextType>({} as CurrencyContextType)

//-------------------------------------------------------------------------

type CurrencyProviderState = {
  currency: CurrencyI
  isLoaded: boolean
}

export class CurrencyProvider extends React.Component<PropsWithChildren<{}>, CurrencyProviderState> {
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
              setCurrency: this.setCurrency
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