import React from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import PictureDetailI, { pictureDetailISchema } from '@shared/interfaces/pictureDetailI'
import FormField from '@components/form/form-field'
import NumericPositiveDecimal2Format from '@components/inputs/numeric-positive-decimal2-format'
import { CurrencyContext } from '@contexts/currency-context-provider'


interface PropsI {
    data: PictureDetailI
    onSave: (data: PictureDetailI) => void
    onClose: () => void
}

export default function PictureDetailEdit(props: PropsI) {
    if (props === undefined) return null
    const forAdd = props.data === null
    const initVal = props.data

    return (
        <>
            <CurrencyContext.Consumer>
                {(currencyContext) => (
                    <Card>
                        <Formik initialValues={initVal}
                            validationSchema={pictureDetailISchema}
                            enableReinitialize={true}
                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                    setSubmitting(false)
                                    props.onSave(values)
                                }, 400)
                            }}
                        >
                            {({ handleReset, submitForm }) => (
                                <>
                                    <Form className='p-2'>
                                        <Row>
                                            <Col>
                                                <FormField
                                                    name="id"
                                                    prefixReactNode={<InputGroup.Text className="p-1">#</InputGroup.Text>}
                                                    addInputGroupText
                                                    addHiddenInput
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormField
                                                    className="mb-3"
                                                    name="name"
                                                    label="Название"
                                                    inputPlaceholder="Введите название матаниала"
                                                    addInput
                                                />
                                            </Col>
                                            <Col>
                                                <FormField
                                                    className="mb-3"
                                                    name="price"
                                                    as={NumericPositiveDecimal2Format}
                                                    label="Цена"
                                                    postfixReactNode={
                                                        <InputGroup.Text className="p-1">
                                                            {currencyContext.currencyHtmlCode}
                                                        </InputGroup.Text>
                                                    }
                                                    addInputGroupInput
                                                    inputPlaceholder="Введите цену"
                                                />
                                            </Col>
                                        </Row>
                                    </Form>
                                    <Form.Group className="text-center pb-2">
                                        <Button variant="primary" type='submit' className='me-3' onClick={submitForm}>Сохранить</Button >
                                        {forAdd && <Button variant="secondary" className='me-3' onClick={handleReset}>Сброс</Button>}
                                        <Button variant="secondary" className='me-3' onClick={props.onClose}>Закрыть</Button>
                                    </Form.Group>
                                </>
                            )}
                        </Formik>
                    </Card>
                )}
            </CurrencyContext.Consumer>
        </>
    )
}