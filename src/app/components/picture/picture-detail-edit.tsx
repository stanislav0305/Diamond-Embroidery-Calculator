import React from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import PictureDetailI, { pictureDetailISchema } from '@shared/interfaces/pictureDetailI'
import FormField from '@components/form/form-field'
import NumericPositiveDecimal2Format from '@components/inputs/numeric-positive-decimal2-format'
import { CurrencyContextType } from '@contexts/currency-context'


interface PropsI {
    currencyContext: CurrencyContextType
    data: PictureDetailI
    onSave: (data: PictureDetailI) => void
    onClose: () => void
}

export default class PictureDetailEdit extends React.Component<PropsI, {}> {
    constructor(props: PropsI) {
        super(props)
    }

    render() {
        const { currencyContext, data, onSave, onClose } = this.props
        const { currencyHtmlCode } = currencyContext!
        const forAdd = data === null
        const initVal = data

        return (
            <Card>
                <Formik initialValues={initVal}
                    validationSchema={pictureDetailISchema}
                    enableReinitialize={true}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            setSubmitting(false)
                            onSave(values)
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
                                            inputPlaceholder="Введите название материала"
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
                                                    {currencyHtmlCode}
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
                                <Button variant="secondary" className='me-3' onClick={onClose}>Закрыть</Button>
                            </Form.Group>
                        </>
                    )}
                </Formik>
            </Card>
        )
    }
}