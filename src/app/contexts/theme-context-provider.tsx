import React, { createContext, PropsWithChildren } from 'react'
import ThemeI from '@shared/interfaces/themeI'
import ThemeModeType from '@shared/types/themeModeType'

type ThemeContextType = {
  theme: ThemeI,
  setTheme: (theme: ThemeI) => void
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

type ThemeProviderState = {
  theme: ThemeI,
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


  componentDidMount = async () => {
    const theme = await window.api.theme.getCurrent()
    console.log('getTheme', theme)

    this.setThemeMode(theme.mode)
    
    this.setState(prev => {
      return {
        ...prev,
        theme,
        isLoaded: true
      }
    })
  }

  setTheme = async (theme: ThemeI) => {
    const savedTheme = await window.api.theme.set(theme)
    console.log('setTheme', savedTheme)

    this.setThemeMode(savedTheme.mode)

    this.setState({
      theme: savedTheme,
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