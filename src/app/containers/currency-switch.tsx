import React from 'react'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { CurrencyContext } from '@contexts/currency-context-provider'
import { CurrencyNameHtmlCodesMap, CurrencyNameType, currencyNames } from '@shared/types/currencyNameType'


export default class CurrencySwitch extends React.Component {
    static contextType = CurrencyContext
    context!: React.ContextType<typeof CurrencyContext>

    onSelectCurrencyName = async (value: string | null, event: React.SyntheticEvent<unknown>) => {
        event.preventDefault()
        console.log('onSelectCurrencyName...')

        const newCurrency = this.context.currency
        newCurrency.name = value as CurrencyNameType

        this.context.setCurrency(newCurrency)
    }

    render() {
        const { name } = this.context.currency

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