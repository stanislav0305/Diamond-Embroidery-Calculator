import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap-icons/font/bootstrap-icons'
import App from '@components/layouts/app'
import { ThemeProvider } from '@contexts/theme-context-provider'
import { EventMessagesProvider } from '@contexts/event-messages-provider'
import LogRendererHelper from '@utils/helpers/logRendererHelper'
import './index.scss'


LogRendererHelper.init()
const container = document.getElementById('root') as HTMLDivElement
if (!container) throw new Error('Failed to find the root element')

const root = createRoot(container!)
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <EventMessagesProvider>
                <App />
            </EventMessagesProvider>
        </ThemeProvider>
    </React.StrictMode>
)