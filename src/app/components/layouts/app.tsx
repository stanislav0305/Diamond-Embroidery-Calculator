import React from 'react'
import { Container } from 'react-bootstrap'
import Footer from '@components/layouts/footer'
import TitleBar from '@components/layouts/navigation/title-bar'
import { ThemeContext } from '@contexts/theme-context-provider'
import MainPage from '@components/pages/main-page'


export default function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="overflow-auto">
                <header>
                    <ThemeContext.Consumer>
                        {(themeContext) => (
                            <TitleBar themeName={themeContext.theme.name}></TitleBar>
                        )}
                    </ThemeContext.Consumer>
                </header>
                <main>
                    <MainPage />
                </main>
            </div>
            <Footer />
        </div >
    )
}