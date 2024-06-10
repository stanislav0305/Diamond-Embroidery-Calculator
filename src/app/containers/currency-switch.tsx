import React from 'react'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { CurrencyContextType } from '@contexts/currency-context'
import { CurrencyNameHtmlCodesMap, CurrencyNameType, currencyNames } from '@shared/types/currencyNameType'


interface PropsI {
    currencyContext: CurrencyContextType
}

export default class CurrencySwitch extends React.Component<PropsI, {}> {
    onSelectCurrencyName = async (value: string | null, event: React.SyntheticEvent<unknown>) => {
        event.preventDefault()
        console.log('onSelectCurrencyName...')

        const {currency, setCurrency} = this.props.currencyContext

        const newCurrency = currency
        newCurrency.name = value as CurrencyNameType

        setCurrency(newCurrency)
    }

    render() {
        const { name } = this.props.currencyContext.currency

        return (
            <Container fluid>
                <Row className='mb-1'>
                    <Col>
                        <label>Валюта:</label>
                    </Col>
                    <Col>
                        <DropdownButton
                            title={CurrencyNameHtmlCodesMap.get(name)}
                            size='sm'
                            className='text-capitalize'
                            onSelect={this.onSelectCurrencyName}
                        >
                            {
                                currencyNames.map((cn) => (
                                    <Dropdown.Item key={cn} eventKey={cn}
                                        className='text-capitalize'
                                    >
                                        {CurrencyNameHtmlCodesMap.get(cn)}
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