import React, { createContext, PropsWithChildren } from 'react'
import AppSettingsI from '@shared/interfaces/appSettingsI'


type AppSettingsContextType = {
  appSettings: AppSettingsI
}

export const AppSettingsContext = createContext<AppSettingsContextType>({
  appSettings: {} as AppSettingsI
} as AppSettingsContextType)

type State = {
  appSettings: AppSettingsI
  isLoaded: boolean
}

export class AppSettingsProvider extends React.Component<PropsWithChildren<{}>, State> {
  constructor(props: PropsWithChildren) {
    super(props)

    this.state = {
      appSettings: {} as AppSettingsI,
      isLoaded: false
    }
  }

  componentDidMount = async () => {
    window.api.app.getSettings()
      .then(appSettings => {
        console.log('getSettings result:', appSettings)

        this.setState(prev => {
          return {
            ...prev,
            appSettings,
            isLoaded: true
          }
        })
      })
      .catch((e: Error) => console.error(e))
  }

  render() {
    const { children } = this.props
    const { appSettings, isLoaded } = this.state

    return (
      <>
        {!isLoaded &&
          <span>Loading ...</span>
        }
        {isLoaded &&
          <AppSettingsContext.Provider
            value={{
              appSettings
            }}
          >
            {children}
          </AppSettingsContext.Provider>
        }
      </>
    )
  }
}