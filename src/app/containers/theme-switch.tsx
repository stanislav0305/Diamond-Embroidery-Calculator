import React from 'react'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { ThemeContext } from '@contexts/theme-context-provider'
import ThemeNameType, { themeNames } from '@shared/types/themeNameType'
import ThemeModeType, { themeModesDataMap } from '@shared/types/themeModeType';


export default class ThemeSwitch extends React.Component {
    static contextType = ThemeContext
    context!: React.ContextType<typeof ThemeContext>

    onSelectThemeMode = async (value: string | null, event: React.SyntheticEvent<unknown>) => {
        event.preventDefault()
        console.log('onSelectThemeMode...')

        const newSettings = this.context.themeSettings
        newSettings.themeMode = value as ThemeModeType

        this.context.setThemeSettings(newSettings)
    }

    onSelectThemeName = async (value: string | null, event: React.SyntheticEvent<unknown>) => {
        event.preventDefault()
        console.log('onSelectThemeName...')

        const newSettings = this.context.themeSettings
        newSettings.themeName = value as ThemeNameType

        this.context.setThemeSettings(newSettings)
    }

    render() {
        const { themeMode, themeName } = this.context.themeSettings

        return (
            <Container fluid>
                <Row className='mb-1'>
                    <Col>
                        <label>Режим темы:</label>
                    </Col>
                    <Col>
                        <Dropdown onSelect={this.onSelectThemeMode}>
                            <Dropdown.Toggle
                                id="dropdown-basic"
                                size='sm'
                                className={themeModesDataMap.get(themeMode)!.css}
                            >
                                {themeModesDataMap.get(themeMode)!.ruName}
                             </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    key='light'
                                    eventKey='light'
                                    className={themeModesDataMap.get('light')!.css}>
                                    {themeModesDataMap.get('light')!.ruName}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key='dark'
                                    eventKey='dark'
                                    className={themeModesDataMap.get('dark')!.css}>
                                    {themeModesDataMap.get('dark')!.ruName}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key='auto'
                                    eventKey='auto'
                                    className={themeModesDataMap.get('auto')!.css}>
                                    {themeModesDataMap.get('auto')!.ruName}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row className='mb-1'>
                    <Col>
                        <label>Тема:</label>
                    </Col>
                    <Col>
                        <DropdownButton
                            title={themeName}
                            size='sm'
                            className='text-capitalize'
                            onSelect={this.onSelectThemeName}
                        >
                            {
                                themeNames.map((tn) => (
                                    <Dropdown.Item key={tn} eventKey={tn}
                                        className='text-capitalize'
                                    >
                                        {tn}
                                    </Dropdown.Item>
                                ))
                            }
                        </DropdownButton>
                    </Col>
                </Row>
            </Container>
        )
    }
}