import React, { createContext, PropsWithChildren } from 'react'
import ThemeI from '@shared/interfaces/themeI'
import ThemeModeType from '@shared/types/themeModeType'

type ThemeContextType = {
  theme: ThemeI
  setTheme: (theme: ThemeI) => void
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

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
              setTheme: this.setTheme
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