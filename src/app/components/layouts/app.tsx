import React from 'react'
import Footer from '@components/layouts/footer'
import TitleBar from '@components/layouts/navigation/title-bar'
import Router from '@components/router'
import { ThemeConsumer } from '@contexts/theme-context'
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
                    <Router />
                </main>
            </div>
            <Footer />
        </div >
    )
}