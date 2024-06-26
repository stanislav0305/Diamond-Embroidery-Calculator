import React from 'react'
import { Route, HashRouter, Routes } from 'react-router-dom'
import MainPage from '@components/pages/main-page'

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" Component={MainPage}  />
            </Routes>
        </HashRouter>
    )
}