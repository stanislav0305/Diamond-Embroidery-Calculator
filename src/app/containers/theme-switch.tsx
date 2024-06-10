import React from 'react'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import ThemeNameType, { themeNames } from '@shared/types/themeNameType'
import ThemeModeType, { themeModesDataMap } from '@shared/types/themeModeType'
import { ThemeContextType } from '@contexts/theme-context'


interface PropsI {
    themeContext: ThemeContextType
}

export default class ThemeSwitch extends React.Component<PropsI, {}> {
    onSelectThemeName = async (value: string | null, event: React.SyntheticEvent<unknown>) => {
        event.preventDefault()
        console.log('onSelectThemeName...')

        this.props.themeContext!.setThemeName(value as ThemeNameType)
    }

    onSelectThemeMode = async (value: string | null, event: React.SyntheticEvent<unknown>) => {
        event.preventDefault()
        console.log('onSelectThemeMode...')

        this.props.themeContext.setThemeMode(value as ThemeModeType)
    }

    render() {
        const { name, mode } = this.props.themeContext.theme

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
                                className={themeModesDataMap.get(mode)!.css}
                            >
                                {themeModesDataMap.get(mode)!.ruName}
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
                            title={name}
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