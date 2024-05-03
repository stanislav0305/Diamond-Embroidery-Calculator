import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import './title-bar'
import { ThemeContext } from '@contexts/theme-context-provider'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import AppSettings from '@components/app-settings'
import ThemeSwitch from '@containers/theme-switch'
import AppSettingsI from '@shared/interfaces/appSettingsI'


interface TitleBarIState {
    isMaximized: boolean,
    appSettingsModal: {
        mode: ModalMode,
        data: AppSettingsI | undefined
    }
}

export default class TitleBar extends React.Component<{}, TitleBarIState> {
    static contextType = ThemeContext
    context!: React.ContextType<typeof ThemeContext>

    constructor(props: {}) {
        super(props)

        this.state = {
            isMaximized: false,
            appSettingsModal: {
                mode: 'closed',
                data: undefined
            }
        }
    }

    componentDidMount() {
        window.api.window.on.unmaximized((_event) => {
            const { isMaximized } = this.state
            if (isMaximized) {
                this.setState({
                    ...this.state,
                    isMaximized: !isMaximized
                })
            }
        })
    }

    componentWillUnmount = async () => {
        await window.api.window.off.unmaximized()
    }

    onClickMinimize = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        await window.api.window.minimize()
    }

    onClickMaximize = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const { isMaximized } = this.state

        const p = await isMaximized ? window.api.window.unmaximize() : window.api.window.maximize()
        p.then(() => {
            this.setState({
                ...this.state,
                isMaximized: !isMaximized
            })
        })
    }

    onClickAppClose = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        await window.api.app.close()
    }

    //--------------------------

    appSettingsModal = {
        onOpen: (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()

            this.appSettingsModal.toogle('loading')
            window.api.app.getSettings()
                .then((data: AppSettingsI) => {
                    this.appSettingsModal.toogle('loaded', data)
                })
        },
        onClose: (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()

            this.appSettingsModal.toogle('closed')
        },
        toogle: (mode: ModalMode = 'closed', data: AppSettingsI | undefined = undefined) => {
            this.setState({
                ...this.state,
                appSettingsModal: {
                    mode,
                    data
                }
            })
        }
    }

    render() {
        const { name } = this.context?.theme ?? {}
        const { isMaximized, appSettingsModal } = this.state
        const { mode, data } = appSettingsModal

        return (
            <>
                <Navbar bg={name} data-bs-theme={name} className='title-bar p-0'>
                    <Navbar.Brand>
                        <div className="d-inline-block align-top logo-img-30x30 mx-1" />
                    </Navbar.Brand>
                    <h6 className="mt-2">Калькулятор алмазной вышевки</h6>
                    <Nav className="ms-auto">
                        <Button as="a" variant="outline-secondary" size="sm" className='bi bi-gear me-3' onClick={this.appSettingsModal.onOpen}></Button>
                        <Button as="a" variant="outline-secondary" size="sm" className='bi bi-dash-lg me-1' onClick={this.onClickMinimize}></Button>
                        <Button as="a" variant="outline-secondary" size="sm" className={`bi ${isMaximized ? 'bi-copy rotate-180-deg' : 'bi-square'} me-1`} onClick={this.onClickMaximize}></Button>
                        <Button as="a" variant="outline-danger" size="sm" className='bi bi-x-lg me-1' onClick={this.onClickAppClose}></Button>
                    </Nav>
                </Navbar>
                <CustomModal header='Настройки'
                    mode={mode}
                    onClose={this.appSettingsModal.onClose}
                    onHide={this.appSettingsModal.toogle}>
                    <ThemeSwitch></ThemeSwitch>
                    <AppSettings appSettings={data} />
                </CustomModal >
            </>
        )
    }
}