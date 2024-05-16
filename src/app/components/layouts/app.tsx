import React from 'react'
import TitleBar from '@containers/title-bar'
import MainPage from '@components/pages/main-page'
import { ThemeContext } from '@contexts/theme-context-provider'


export default function App() {
    return (
        <>
            <ThemeContext.Consumer>
                {(themeContext) => (
                    <TitleBar themeName={themeContext.theme.name}></TitleBar>
                )}
            </ThemeContext.Consumer>
            <MainPage></MainPage>
        </>
    )
}