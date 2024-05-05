import React from 'react'
import { Button, Card, Col, Form, Row, Accordion } from 'react-bootstrap'
import { Formik } from 'formik';
import { coverageAreasDataMap } from '@shared/types/coverageAreaType';
import { diamondFormDataMap } from '@shared/types/diamondFormType';
import PictureI, { PictureDetailI, PictureISchema } from '@shared/interfaces/pictureI'
import PicturesDetailsTable from '@containers/picture/picture-details-table'
import FormField from '@components/form/form-field';
import FormFieldSelect from '@components/form/form-field-select';


export default function PictureEdit(props: {
    data: PictureI,
    onSave: (data: PictureI) => void,
    onClose: () => void
}) {
    if (props === undefined) return null
    const forAdd = props.data.id === ''
    const initVal = props.data

     
    const [details, setDetails] = React.useState<PictureDetailI[]>(props.data.details)
    const onDetailsChenger = (details: PictureDetailI[]) => {
        setDetails(details)
    }

    return (
        <>
            <Card>
                <Formik initialValues={initVal}
                    validationSchema={PictureISchema}
                    enableReinitialize={true}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            setSubmitting(false)

                            values.details = details
                            props.onSave(values)
                        }, 400);
                    }}
                >
                    {({ values, handleReset, submitForm }) => (
                        <>
                            <Form className='p-1'>
                                <Row>
                                    <Col>
                                        <FormField
                                            name="id"
                                            type="hidden"
                                            prefixReactNode={<span>#</span>}
                                            showValInSpan={true}
                                        />
                                    </Col>
                                    <Col sm="7">
                                        <FormField
                                            name="created"
                                            type="hidden"
                                            prefixReactNode={<span>Создана</span>}
                                            showValInSpan={true}
                                        />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col></Col>
                                    <Col sm="7">
                                        <FormField
                                            name="updated"
                                            type="hidden"
                                            prefixReactNode={<span>Обновлена</span>}
                                            showValInSpan={true}
                                        />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col>
                                        <FormField
                                            name="height"
                                            type="number"
                                            prefixReactNode={<span className='fw-bold'>Высота</span>}
                                            postfixReactNode={<span className='fw-bold'>см</span>}
                                            placeholder="Введите высоту"
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            name="width"
                                            type="number"
                                            prefixReactNode={<span className='fw-bold'>Ширина</span>}
                                            postfixReactNode={<span className='fw-bold'>см</span>}
                                            placeholder="Введите ширину"
                                        />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col>
                                        <FormFieldSelect
                                            name="diamondForm"
                                            label="Форма кристала"
                                            options={diamondFormDataMap}
                                        />
                                    </Col>
                                    <Col>
                                        <FormFieldSelect
                                            name="coverageArea"
                                            label="Площадь покрытия"
                                            options={coverageAreasDataMap}
                                        />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>Материалы картины</Accordion.Header>
                                                <Accordion.Body className='p-0'>
                                                    <PicturesDetailsTable pictureDetails={details} onDetailsChenge={onDetailsChenger} />
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        <FormField
                                            className="mt-1 fw-bold"
                                            name="detailsSumTotal"
                                            type="hidden"
                                            prefixReactNode={<span className="fw-bold">Всего за материалы</span>}
                                            classNameForSpan="fw-bold px-4"
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                            showValInSpan={true}
                                            value={details.reduce((sum, pd) => sum + pd.price, 0)}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormField
                                            name="pricePerHour"
                                            type="number"
                                            prefixReactNode={<span>Цена за час</span>}
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                            placeholder="Введите цену за час"
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            name="hoursSpent"
                                            type="number"
                                            prefixReactNode={<span>Затрачено часов</span>}
                                            placeholder="Введите количество затрачено часов"
                                        />
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col>
                                        <FormField
                                            className="fw-bold"
                                            name="forHoursSpentTotal"
                                            type="hidden"
                                            classNameForSpan="fw-bold px-4"
                                            prefixReactNode={<span className='fw-bold'>Всего за потраченные часы</span>}
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                            showValInSpan={true}
                                            value={values.pricePerHour * values.hoursSpent}
                                        />
                                    </Col>
                                </Row>
                                <FormField
                                    className="mb-4"
                                    as="textarea"
                                    name="comment"
                                    label="Коментарий"
                                />
                                <FormField
                                    name="bayFullPrice"
                                    type="number"
                                    prefixReactNode={<span className='fw-bold'>Продаю за</span>}
                                    postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                    placeholder="Введите цену продажи"
                                />
                            </Form>
                            <Form.Group className="text-center pb-2">
                                <Button variant="primary" type='submit' className='me-3' onClick={submitForm}>Сохранить</Button >
                                {forAdd && <Button variant="secondary" className='me-3' onClick={handleReset}>Сброс</Button>}
                                <Button variant="secondary" className='me-3' onClick={props.onClose}>Закрыть</Button>
                            </Form.Group>
                        </>
                    )}
                </Formik>
            </Card >
        </>
    )
}