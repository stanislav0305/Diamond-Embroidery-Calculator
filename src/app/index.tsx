import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap-icons/font/bootstrap-icons'
import App from '@components/layouts/app'
import LogRendererHelper from '@utils/helpers/logRendererHelper'
import './index.scss'
import { AppSettingsProvider } from '@contexts/app-settings-context'
import { ThemeProvider } from '@contexts/theme-context'
import { CurrencyProvider } from '@contexts/currency-context'
import { EventMessageConsumer, EventMessagesProvider } from '@contexts/event-messages-context'
import { PicturesDefaultSetProvider } from '@contexts/pictures-default-set-context'


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
                        <EventMessageConsumer>
                            {eventMessagesContext =>
                                <PicturesDefaultSetProvider eventMessagesContext={eventMessagesContext}>
                                    <App />
                                </PicturesDefaultSetProvider>
                            }
                        </EventMessageConsumer>
                    </EventMessagesProvider>
                </CurrencyProvider>
            </ThemeProvider>
        </AppSettingsProvider>
    </React.StrictMode>
)