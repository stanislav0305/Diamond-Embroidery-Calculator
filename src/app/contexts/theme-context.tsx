import React, { PropsWithChildren, createContext } from 'react'
import ThemeI from '@shared/interfaces/themeI'
import ThemeModeType from '@shared/types/themeModeType'
import ThemeNameType from '@shared/types/themeNameType'


export type ThemeContextType = {
  theme: ThemeI
  setThemeMode: (themeMode: ThemeModeType) => void
  setThemeName: (themeName: ThemeNameType) => void
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

//------------------------------------------------------------------------

type ThemeProviderState = {
  theme: ThemeI
  isLoaded: boolean
}

export class ThemeProvider extends React.Component<PropsWithChildren<{}>, ThemeProviderState> {
  constructor(props: PropsWithChildren) {
    super(props)

    this.state = {
      theme: {} as ThemeI,
      isLoaded: false
    }
  }

  componentDidMount = () => {
    window.api.theme.getCurrent()
      .then((theme: ThemeI) => {
        console.log('getTheme', theme)

        this.changeThemeModeInHtml(theme.mode)

        this.setState(prev => {
          return {
            ...prev,
            theme,
            isLoaded: true
          }
        })
      })
  }

  setTheme = (theme: ThemeI) => {
    window.api.theme.set(theme)
      .then((theme: ThemeI) => {
        console.log('setTheme', theme)

        this.changeThemeModeInHtml(theme.mode)

        this.setState({
          theme: theme,
          isLoaded: true
        })
      })
  }

  setThemeName = (themeName: ThemeNameType) => {
    const newTheme = {
      ...this.state.theme,
      name: themeName
    }

    this.setTheme(newTheme)
  }

  setThemeMode = (themeMode: ThemeModeType) => {
    const newTheme = {
      ...this.state.theme,
      mode: themeMode
    }

    this.setTheme(newTheme)
  }

  changeThemeModeInHtml = (mode: ThemeModeType) => {
    if (mode === 'auto')
      document.documentElement.removeAttribute('data-bs-theme')
    else
      document.documentElement.setAttribute('data-bs-theme', mode)
  }

  render() {
    const { children } = this.props
    const { theme, isLoaded } = this.state
    const themePath = `${theme.name}-theme.css`

    return (
      <>
        {!isLoaded &&
          <span>Loading ...</span>
        }
        {isLoaded &&
          <ThemeContext.Provider
            value={{
              theme,
              setThemeName: this.setThemeName,
              setThemeMode: this.setThemeMode
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

//------------------------------------------------------------------------

export const ThemeConsumer = ThemeContext.Consumer 
