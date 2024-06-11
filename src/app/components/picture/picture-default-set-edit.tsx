import React from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import PicturesDefaultSetI, { picturesDefaultSetDefaultISchema } from '@shared/interfaces/picturesDefaultSetI'
import PictureDetailI from '@shared/interfaces/pictureDetailI'
import PicturesDetailsTable from '@containers/picture/picture-details-table'
import FormField from '@components/form/form-field'
import NumericPositiveDecimal2Format from '@components/inputs/numeric-positive-decimal2-format'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { ColumnOrderState, SortingState, Updater, VisibilityState } from '@tanstack/react-table'
import { ColumnSortI } from '@shared/interfaces/columnSortI'
import { CurrencyContextType } from '@contexts/currency-context'
import { CurrencyI } from '@shared/interfaces/currencyI'
import { Subscription } from 'rxjs'


interface PropsI {
    currencyContext: CurrencyContextType
    data: PicturesDefaultSetI
    onSave: (data: PicturesDefaultSetI) => void
    onClose: () => void
}

interface State {
    initVal: PicturesDefaultSetI
    details: PictureDetailI[]
    tableOptions: TableOptionsI
}

export default class PictureDefaultSetEdit extends React.Component<PropsI, State> {
    currencyChangeSubscription?: Subscription = undefined

    constructor(props: PropsI) {
        super(props)

        let { data } = this.props
        data = JSON.parse(JSON.stringify(data)) as PicturesDefaultSetI

        this.state = {
            initVal: data,
            details: data.details,
            tableOptions: {
                columnOrder: [],
                columnVisibility: {},
                columnSort: [] as ColumnSortI[],
            } as TableOptionsI,
        }
    }

    componentDidMount(): void {
        window.api.picturesDefaultSet.tableOptions.get()
            .then((opts: TableOptionsI) => {
                this.setState(prev => {
                    return {
                        ...prev,
                        tableOptions: {
                            ...opts
                        },
                    }
                })
            })

            this.currencyChangeSubscription = this.props.currencyContext.subscribeCurrencyChange(currency => {
                this.currencyChenged(currency)
            })
    }

    componentWillUnmount(): void {
        this.currencyChangeSubscription?.unsubscribe()
    }

    //---------------------------------------------------------------

    currencyChenged(currency: CurrencyI) {
        //refresh details table if changed currency simbol
        console.log('currencyChenged in PictureDefaultSetEdit...')

        this.setState(prev => {
            return {
                ...prev,
                details: [...prev.details]
            }
        })
    }

    //---------------------------------------------------------------

    onDetailsChenge = (details: PictureDetailI[]) => {
        this.setState(prev => {
            return {
                ...prev,
                details
            }
        })
    }

    //---------------------------------------------------------------

    onColumnVisibilityChange = (updater: Updater<VisibilityState>) => {
        this.setState(prev => {
            const model = (updater instanceof Function ? updater(prev.tableOptions.columnVisibility) : updater) as object
            window.api.picturesDefaultSet.tableOptions.setColumnVisibility(model)

            return {
                ...prev,
                tableOptions: {
                    ...prev.tableOptions,
                    columnVisibility: { ...model }
                }
            }
        })

    }

    onColumnOrderChange = (updater: Updater<ColumnOrderState>) => {
        this.setState(prev => {
            const model = (updater instanceof Function ? updater(prev.tableOptions.columnOrder) : updater) as string[]

            if (prev && model
                && prev.tableOptions.columnOrder.length > 0 && model.length > 0
                && model.filter((item, index) => { return prev.tableOptions.columnOrder[index] !== item }).length > 0) {
                //save only if arrays are defferent
                window.api.picturesDefaultSet.tableOptions.setColumnOrder(model)
            }

            return {
                ...prev,
                tableOptions: {
                    ...prev.tableOptions,
                    columnOrder: [...model]
                }
            }
        })
    }

    onSortingChange = (updater: Updater<SortingState>) => {
        this.setState(prev => {
            const model = (updater instanceof Function ? updater(prev.tableOptions.columnSort) : updater) as ColumnSortI[]

            if (prev.tableOptions.columnSort && model
                && ((prev.tableOptions.columnSort.length !== model.length)
                    || (model.filter((item, index) => {
                        return prev.tableOptions.columnSort[index].id !== item.id
                            || prev.tableOptions.columnSort[index].desc !== item.desc
                    }).length > 0))) {
                //save only if arrays are defferent
                window.api.picturesDefaultSet.tableOptions.setColumnSort(model)
            }

            return {
                ...prev,
                tableOptions: {
                    ...prev.tableOptions,
                    columnSort: model.map((col: ColumnSortI) => { return { ...col } })
                }
            }
        })
    }
    //---------------------------------------------------------------

    render() {
        const { initVal, details, tableOptions } = this.state
        const { currencyContext } = this.props
        const detailsSumTotal = details.reduce((sum, pd) => sum + pd.price, 0)

        return (
            <Card>
                <Formik initialValues={initVal}
                    validationSchema={picturesDefaultSetDefaultISchema}
                    enableReinitialize={true}
                    errors
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            setSubmitting(false)

                            values.details = details
                            this.props.onSave(values)
                        }, 400)
                    }}
                >
                    {({ values, errors, touched, submitForm }) => (
                        <>
                            <div>
                                {(!!Object.values(errors).length && !!Object.values(touched).length) &&
                                    <h6 className='text-danger m-1 fw-bold'>Исправьте ошибки</h6>
                                }
                                {!!Object.values(errors).length &&
                                    Object.entries(errors)
                                        /* First, we exclude fields for which it is unnecessary to display errors at the top 
                                        (they are already displayed near the input fields) */
                                        .filter(([key,]) => !['detailsSumTotal', 'pricePerHour']
                                            .includes(key))
                                        .map(([, error]) => (
                                            <span className='text-danger d-inline-block'>{JSON.stringify(error)}</span>
                                        ))}
                            </div>
                            <Form className="p-1">
                                <h6>Материалы картины по умолчанию</h6>
                                <PicturesDetailsTable
                                    pictureDetails={details}
                                    onDetailsChenge={this.onDetailsChenge}
                                    tableOptions={tableOptions}
                                    currencyHtmlCode={currencyContext.currencyHtmlCode}
                                    onColumnVisibilityChange={this.onColumnVisibilityChange}
                                    onColumnOrderChange={this.onColumnOrderChange}
                                    onSortingChange={this.onSortingChange}
                                />
                                <Row>
                                    <Col>
                                        <FormField
                                            className="mt-1 fw-bold"
                                            name="detailsSumTotal"
                                            as={NumericPositiveDecimal2Format}
                                            prefixReactNode={
                                                <InputGroup.Text className="p-1 fw-bold">
                                                    Всего за материалы
                                                </InputGroup.Text>
                                            }
                                            addInputGroupText
                                            postfixReactNode={
                                                <InputGroup.Text className="p-1">
                                                    {currencyContext.currencyHtmlCode}
                                                </InputGroup.Text>
                                            }
                                            addHiddenInput
                                            value={detailsSumTotal}
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            name="pricePerHour"
                                            as={NumericPositiveDecimal2Format}
                                            prefixReactNode={
                                                <InputGroup.Text className="p-1">
                                                    Цена за час
                                                </InputGroup.Text>
                                            }
                                            addInputGroupInput
                                            postfixReactNode={
                                                <InputGroup.Text className="p-1">
                                                    {currencyContext.currencyHtmlCode}
                                                </InputGroup.Text>
                                            }
                                            inputPlaceholder="Введите цену за час"
                                        />
                                    </Col>
                                </Row>
                            </Form>
                            <Form.Group className="text-center pb-2">
                                <Button variant="primary" type="submit" className="me-3" onClick={submitForm}>Сохранить</Button>
                                <Button variant="secondary" className="me-3" onClick={this.props.onClose}>Закрыть</Button>
                            </Form.Group>
                        </>
                    )}
                </Formik>
            </Card >
        )
    }
}