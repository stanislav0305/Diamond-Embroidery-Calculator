import React from 'react'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import AppSettings from '@components/app-settings'
import ThemeSwitch from '@containers/theme-switch'
import CurrencySwitch from '@containers/currency-switch'
import { CurrencyContextType } from '@contexts/currency-context'
import { ThemeContextType } from '@contexts/theme-context'
import { AppSettingsContextType } from '@contexts/app-settings-context'


interface PropsI {
    themeContext: ThemeContextType
    appSettingsContext: AppSettingsContextType
    currencyContext: CurrencyContextType
}

interface StateI {
    mode: ModalMode
}

export default class AppSettingsModal extends React.Component<PropsI, StateI> {
    constructor(props: PropsI) {
        super(props)

        this.state = {
            mode: 'closed',
        }
    }

    onOpen = () => {
        this.toggle('loaded')
    }

    onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.toggle('closed')
    }

    toggle = (mode: ModalMode = 'closed') => {
        this.setState(prev => {
            return {
                ...prev,
                mode
            }
        })
    }

    render() {
        const { themeContext, appSettingsContext, currencyContext } = this.props
        const { mode } = this.state

        return (
            <CustomModal header='Настройки'
                mode={mode}
                onClose={this.onClose}
                onHide={this.toggle}>
                <ThemeSwitch themeContext={themeContext} />
                <CurrencySwitch currencyContext={currencyContext} />
                <AppSettings appSettingsContext={appSettingsContext} />
            </CustomModal>
        )
    }
}