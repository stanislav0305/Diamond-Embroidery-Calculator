import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import './title-bar'
import AppSettingsModal from '@containers/app-settings-modal'
import { CurrencyConsumer } from '@contexts/currency-context'
import { ThemeConsumer } from '@contexts/theme-context'
import { AppSettingsConsumer } from '@contexts/app-settings-context'


interface PropsI {
}

interface StateI {
    isMaximized: boolean
}

export default class TitleBar extends React.Component<PropsI, StateI> {
    private appSettingsModalRef: React.RefObject<AppSettingsModal> = React.createRef<AppSettingsModal>()

    constructor(props: PropsI) {
        super(props)

        this.state = {
            isMaximized: false
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

    //----------------------------------------------------

    openAppSettingsModal(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        this.appSettingsModalRef.current!.onOpen()
    }

    render() {
        const { isMaximized } = this.state

        return (
            <AppSettingsConsumer>
                {appSettingsContext =>
                    <ThemeConsumer>
                        {themeContext =>
                            <>
                                <Navbar bg={themeContext.theme.name}
                                    data-bs-theme={themeContext.theme.name}
                                    className='title-bar p-0'
                                >
                                    <Navbar.Brand>
                                        <div className="d-inline-block align-top logo-img-30x30 mx-1" />
                                    </Navbar.Brand>
                                    <h6 className="mt-2">Калькулятор алмазной вышивки v{appSettingsContext.appSettings.versions.app}</h6>
                                    <Nav className="ms-auto">
                                        <Button as="a"
                                            variant="outline-secondary"
                                            size="sm"
                                            className='bi bi-gear me-3'
                                            onClick={(e) => this.openAppSettingsModal(e)}
                                        >
                                        </Button>
                                        <Button as="a"
                                            variant="outline-secondary"
                                            size="sm"
                                            className='bi bi-dash-lg me-1'
                                            onClick={this.onClickMinimize}
                                        >
                                        </Button>
                                        <Button as="a"
                                            variant="outline-secondary"
                                            size="sm"
                                            className={`bi ${isMaximized ? 'bi-copy rotate-180-deg' : 'bi-square'} me-1`}
                                            onClick={this.onClickMaximize}
                                        >
                                        </Button>
                                        <Button as="a"
                                            variant="outline-danger"
                                            size="sm"
                                            className='bi bi-x-lg me-1'
                                            onClick={this.onClickAppClose}
                                        >
                                        </Button>
                                    </Nav>
                                </Navbar>

                                <CurrencyConsumer>
                                    {currencyContext =>

                                        <AppSettingsModal
                                            ref={this.appSettingsModalRef}
                                            appSettingsContext={appSettingsContext}
                                            themeContext={themeContext}
                                            currencyContext={currencyContext}
                                        />

                                    }
                                </CurrencyConsumer>

                            </>
                        }
                    </ThemeConsumer>
                }
            </AppSettingsConsumer>
        )
    }
}