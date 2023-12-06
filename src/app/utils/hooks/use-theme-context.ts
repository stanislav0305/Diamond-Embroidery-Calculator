import { useContext } from 'react'
import { ThemeContext } from '@contexts/theme-context-provider'


export const useThemeContext = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useThemeContext must be used inside the ThemeProvider')
    }

    return context
}