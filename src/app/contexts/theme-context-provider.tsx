import React, { createContext, PropsWithChildren, useState } from 'react'
import ThemeSettingsI from '@shared/interfaces/themeSettingsI'
import ThemeModeType from '@shared/types/themeModeType'

type ThemeContextType = {
  themeSettings: ThemeSettingsI,
  setThemeSettings: (themeSettings: ThemeSettingsI) => void
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

type ThemeProviderState = {
  themeSettings: ThemeSettingsI,
  isLoaded: boolean
}

export class ThemeProvider extends React.Component<PropsWithChildren<{}>, ThemeProviderState> {
  constructor(props: PropsWithChildren) {
    super(props)

    this.state = {
      themeSettings: {} as ThemeSettingsI,
      isLoaded: false
    }
  }


  componentDidMount = async () => {
    const themeSettings = await window.api.theme.getCurrent()
    console.log('getTheme', themeSettings)

    this.setThemeMode(themeSettings.themeMode)
    
    this.setState(prev => {
      return {
        ...prev,
        themeSettings,
        isLoaded: true
      }
    })
  }

  setTheme = async (settings: ThemeSettingsI) => {
    const themeSettings = await window.api.theme.set(settings)
    console.log('setTheme', themeSettings)

    this.setThemeMode(themeSettings.themeMode)

    this.setState({
      themeSettings,
      isLoaded: true
    })
  }

  setThemeMode = (mode: ThemeModeType) => {
    if (mode === 'auto')
      document.documentElement.removeAttribute('data-bs-theme')
    else
      document.documentElement.setAttribute('data-bs-theme', mode)
  }

  render() {
    const { children } = this.props
    const { themeSettings, isLoaded } = this.state
    const themePath = `${themeSettings.themeName}-theme.css`

    return (
      <>
        {!isLoaded &&
          <span>Loading ...</span>
        }
        {isLoaded &&
          <ThemeContext.Provider
            value={{
              themeSettings: themeSettings,
              setThemeSettings: this.setTheme
            }}
          >
            {children}
            <link rel='stylesheet' type='text/css' href={themePath} />
          </ThemeContext.Provider>
        }
      </>
    )
  }
}