import React from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import PicturesDefaultSetI, { picturesDefaultSetDefaultISchema } from '@shared/interfaces/picturesDefaultSetI'
import PictureDetailI from '@shared/interfaces/pictureDetailI'
import PicturesDetailsTable from '@containers/picture/picture-details-table'
import FormField from '@components/form/form-field'
import NumericPositiveDecimal2Format from '@components/inputs/numeric-positive-decimal2-format'


interface Props {
    data: PicturesDefaultSetI
    onSave: (data: PicturesDefaultSetI) => void
    onClose: () => void
}

interface State {
    initVal: PicturesDefaultSetI
    details: PictureDetailI[]
}

export default class PictureDefaultSetEdit extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        let { data } = this.props
        data = JSON.parse(JSON.stringify(data)) as PicturesDefaultSetI

        this.state = {
            initVal: data,
            details: data.details,
        }
    }

    onDetailsChenge = (details: PictureDetailI[]) => {
        this.setState(prev => {
            return {
                ...prev,
                details
            }
        })
    }

    //---------------------------------------------------------------

    render() {
        const { initVal, details } = this.state
        const detailsSumTotal = details.reduce((sum, pd) => sum + pd.price, 0)

        return (
            <>
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
                                            /* вначале исключаем поля для которых ненужно отображать ошибки с верху 
                                            (они уже отображаются возле полей ввода) */
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
                                                        <i className="bi bi-currency-euro"></i>
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
                                                        <i className="bi bi-currency-euro"></i>
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
            </>
        )
    }
}