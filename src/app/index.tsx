import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap-icons/font/bootstrap-icons'
import App from '@components/layouts/app'
import { ThemeProvider } from '@contexts/theme-context-provider'
import LogRendererHelper from '@utils/helpers/logRendererHelper'
import './index.scss'


LogRendererHelper.init()
const container = document.getElementById('app') as HTMLDivElement
const root = createRoot(container!)
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
)