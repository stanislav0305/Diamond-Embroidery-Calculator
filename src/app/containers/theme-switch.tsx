import React from 'react'
import { Form } from 'react-bootstrap'
import { ThemeContext } from '@contexts/theme-context-provider'
import ThemeSettingsI from '@shared/theme/themeSettingsI'


const darkThemeSettings: ThemeSettingsI = {
    nativeThemeName: 'dark',
    themeName: 'dark'
}

const liteThemeSettings: ThemeSettingsI = {
    nativeThemeName: 'light',
    themeName: 'light'
}

export default class ThemeSwitch extends React.Component {
    static contextType = ThemeContext
    context!: React.ContextType<typeof ThemeContext>

    onClickToggleTheme = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        console.log('onClickToggleTheme')

        const newSettings = this.context?.themeSettings?.themeName === 'light' ? darkThemeSettings : liteThemeSettings
        this.context?.setThemeSettings(newSettings)
    }

    render() {
        const themeName = this.context?.themeSettings?.themeName

        return (
            <div>
                <span>Текущаяя тема: <strong>{themeName}</strong></span>
                <Form.Check
                    type='switch'
                    label={`Переключить на ${themeName === 'light' ? 'Dark' : 'Light'} Mode`}
                    checked={themeName === 'light'}
                    onChange={this.onClickToggleTheme}
                />
            </div>
        )
    }
}