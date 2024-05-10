import React from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Formik } from 'formik';
import { PictureDetailI, PictureDetailISchema } from '@shared/interfaces/pictureI'
import FormField from '@components/form/form-field';
import NumericPositiveDecimal2Format from '@components/inputs/numeric-positive-decimal2-format';


export default function PictureDetailEdit(props: {
    data: PictureDetailI,
    onSave: (data: PictureDetailI) => void,
    onClose: () => void
}) {
    if (props === undefined) return null
    const forAdd = props.data === null
    const initVal = props.data

    return (
        <>
            <Card>
                <Formik initialValues={initVal}
                    validationSchema={PictureDetailISchema}
                    enableReinitialize={true}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            setSubmitting(false)
                            props.onSave(values)
                        }, 400);
                    }}
                >
                    {({ handleReset, submitForm }) => (
                        <>
                            <Form className='p-2'>
                                <Row>
                                    <Col>
                                        <FormField
                                            name="id"
                                            prefixReactNode={<span>#</span>}
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
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
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
        </>
    )
}