import React from 'react'
import Footer from '@components/layouts/footer'
import TitleBar from '@components/layouts/navigation/title-bar'
import MainPage from '@components/pages/main-page'
import { ThemeConsumer } from '@contexts/theme-context'
import AppSettings from '@components/app-settings'
import { AppSettingsConsumer } from '@contexts/app-settings-context'


export default function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="overflow-auto">
                <header>
                    <AppSettingsConsumer>
                        {appSettingsContext =>
                            <ThemeConsumer>
                                {context => <TitleBar themeContext={context} appSettingsContext={appSettingsContext} />}
                            </ThemeConsumer>
                        }
                    </AppSettingsConsumer>
                </header>
                <main>
                    <MainPage />
                </main>
            </div>
            <Footer />
        </div >
    )
}