import React from 'react'
import Footer from '@components/layouts/footer'
import TitleBar from '@components/layouts/navigation/title-bar'
import Router from '@components/router'


export default function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="overflow-auto">
                <header>
                    <TitleBar />
                </header>
                <main>
                    <Router />
                </main>
            </div>
            <Footer />
        </div >
    )
}