import React from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Formik } from 'formik';
import { PictureDetailI, PictureDetailISchema } from '@shared/interfaces/pictureI'
import FormField from '@components/form/form-field';


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
                                            type="hidden"
                                            prefixReactNode={<span>#</span>}
                                            showValInSpan={true}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormField
                                            className="mb-3"
                                            name="name"
                                            label="Название"
                                            placeholder="Введите название матаниала"
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            className="mb-3"
                                            name="price"
                                            type="number"
                                            label="Цена"
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                            placeholder="Введите цену"
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