import React from 'react'
import { Navbar, Nav, Button, Card, ListGroup } from 'react-bootstrap'
import { ThemeContext } from '@contexts/theme-context-provider'
import logo from '@assets/diamond.png'
import CustomModal from '@components/layouts/custom-modal'
import ThemeSwitch from '@containers/theme-switch'
import AppSettingsI from '@shared/interfaces/appSettingsI'


interface TitleBarIState {
    isMaximized: boolean,
    showModal: boolean,
    appSettings: AppSettingsI | null
}

export default class TitleBar extends React.Component<{}, TitleBarIState> {
    static contextType = ThemeContext
    context!: React.ContextType<typeof ThemeContext>

    constructor(props: {}) {
        super(props)

        this.state = {
            isMaximized: false,
            showModal: false,
            appSettings: null
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

    onClickOpenSettings = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        await window.api.app.getSettings()
            .then((appSettings: AppSettingsI) => {
                this.toogleSettings(appSettings)
            })
    }

    onClickCloseSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.toogleSettings()
    }

    toogleSettings = (appSettings: AppSettingsI | null = null) => {
        this.setState({
            ...this.state,
            showModal: !this.state.showModal,
            appSettings: appSettings
        })
    }

    render() {
        const { themeName } = this.context?.themeSettings ?? {}
        const { isMaximized, showModal, appSettings } = this.state

        return (
            <>
                <Navbar bg={themeName} data-bs-theme={themeName} className='title-bar p-0'>
                    <Navbar.Brand>
                        <img
                            alt="logo"
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Button as="a" variant="outline-secondary" size="sm" className='bi bi-gear me-3' onClick={this.onClickOpenSettings}></Button>
                        <Button as="a" variant="outline-secondary" size="sm" className='bi bi-dash-lg me-1' onClick={this.onClickMinimize}></Button>
                        <Button as="a" variant="outline-secondary" size="sm" className={`bi ${isMaximized ? 'bi-copy rotate-180-deg' : 'bi-square'} me-1`} onClick={this.onClickMaximize}></Button>
                        <Button as="a" variant="outline-danger" size="sm" className='bi bi-x-lg me-1' onClick={this.onClickAppClose}></Button>
                    </Nav>
                </Navbar>
                <CustomModal header='Настройки'
                    show={showModal}
                    showBtnSave={false}
                    onClose={this.onClickCloseSettings}
                    onHide={this.toogleSettings}>
                    <ThemeSwitch></ThemeSwitch>
                    {appSettings &&
                        <>
                            <Card>
                                <ListGroup className='list-group-flush'>
                                    <ListGroup.Item>
                                        <label className='me-2'>Путь к логам:</label>
                                        {appSettings.paths.logPath}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                            <Card className='mt-1'>
                                <ListGroup className='list-group-flush'>
                                    <ListGroup.Item>
                                        <strong>Node v</strong>
                                        {appSettings.versions.node}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Electron v</strong>
                                        {appSettings.versions.electron}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Chrome v</strong>
                                        {appSettings.versions.chrome}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </>
                    }
                </CustomModal >
            </>
        )
    }
}