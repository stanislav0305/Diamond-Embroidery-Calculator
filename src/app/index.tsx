import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@components/layouts/app';
import { ThemeProvider } from '@contexts/theme-context-provider'
import LogRendererHelper from '@utils/helpers/logRendererHelper'


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