import React, { createContext, PropsWithChildren, useState } from 'react'
import ThemeSettingsI from '@shared/theme/themeSettingsI'


type ThemeContextType = {
  themeSettings: ThemeSettingsI | undefined,
  setThemeSettings: (themeSettings: ThemeSettingsI) => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettingsI | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const triggerThemeSettings = (themeSettings: ThemeSettingsI) => {
    setTheme(themeSettings)
  }

  const getTheme = async () => {
    await window.api.theme.getCurrent()
      .then((settings: ThemeSettingsI) => {
        console.log('Loaded !!!!!!!!')
        setThemeSettings(settings)
        setIsLoaded(true)
      })
  }

  const setTheme = async (settings: ThemeSettingsI) => {
    await window.api.theme.set(settings)
      .then(() => {
        console.log('Set theme !!!!!!!!')
        setThemeSettings(settings)
        setIsLoaded(true)
      })
  }

  if (!isLoaded)
    getTheme()

  return (
    <>
      {!isLoaded &&
        <span>Loading ...</span>
      }
      {isLoaded &&
        <ThemeContext.Provider
          value={{
            themeSettings: themeSettings,
            setThemeSettings: triggerThemeSettings
          }}
        >
          {children}
        </ThemeContext.Provider>
      }
    </>
  )
}