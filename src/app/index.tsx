import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap-icons/font/bootstrap-icons'
import { AppSettingsProvider } from '@contexts/app-settings-context-provider'
import { ThemeProvider } from '@contexts/theme-context-provider'
import { EventMessagesProvider } from '@contexts/event-messages-provider'
import App from '@components/layouts/app'
import LogRendererHelper from '@utils/helpers/logRendererHelper'
import './index.scss'
import { CurrencyProvider } from '@contexts/currency-context-provider'


LogRendererHelper.init()
const container = document.getElementById('root') as HTMLDivElement
if (!container) throw new Error('Failed to find the root element')

const root = createRoot(container!)
root.render(
    <React.StrictMode>
        <AppSettingsProvider>
            <ThemeProvider>
                <CurrencyProvider>
                    <EventMessagesProvider>
                        <App />
                    </EventMessagesProvider>
                </CurrencyProvider>
            </ThemeProvider>
        </AppSettingsProvider>
    </React.StrictMode>
)