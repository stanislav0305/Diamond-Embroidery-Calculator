import React from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
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
    const forAdd = props.data === null
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
                                    <Col className='pe-0'>
                                        <FormField
                                            name="created"
                                            type="hidden"
                                            prefixReactNode={<span>Создана</span>}
                                            showValInSpan={true}
                                        />
                                    </Col>
                                    <Col className='ps-0'>
                                        <FormField
                                            name="updated"
                                            type="hidden"
                                            prefixReactNode={<span>Обновлена</span>}
                                            showValInSpan={true}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormField
                                            className="mb-3"
                                            name="height"
                                            type="number"
                                            prefixReactNode={<span className='fw-bold'>Высота</span>}
                                            postfixReactNode={<span className='fw-bold'>см</span>}
                                            placeholder="Введите высоту"
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            className="mb-3"
                                            name="width"
                                            type="number"
                                            prefixReactNode={<span className='fw-bold'>Ширина</span>}
                                            postfixReactNode={<span className='fw-bold'>см</span>}
                                            placeholder="Введите ширину"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormFieldSelect
                                            className="mb-3"
                                            name="diamondForm"
                                            label="Форма кристала"
                                            options={diamondFormDataMap}
                                        />
                                    </Col>
                                    <Col>
                                        <FormFieldSelect
                                            className="mb-3"
                                            name="coverageArea"
                                            label="Площадь покрытия"
                                            options={coverageAreasDataMap}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <PicturesDetailsTable pictureDetails={details} onDetailsChenge={onDetailsChenger} />
                                        <FormField
                                            className="mt-1 mb-3 fw-bold"
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
                                            className="mb-3"
                                            name="pricePerHour"
                                            type="number"
                                            label="Цена за час"
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                            placeholder="Введите цену за час"
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            className="mb-3"
                                            name="hoursSpent"
                                            type="number"
                                            label="Затрачено часов"
                                            placeholder="Введите количество затрачено часов"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormField
                                            className="mb-3 fw-bold"
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
                                    className="mb-3"
                                    name="bayFullPrice"
                                    type="number"
                                    prefixReactNode={<span className='fw-bold'>Продано за</span>}
                                    postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                    placeholder="Введите цену продажи"
                                />
                                <FormField
                                    as="textarea"
                                    className="mb-3"
                                    name="comment"
                                    label="Коментарий"
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

//<Form.Label className="fw-bold">Всего за материалы</Form.Label>
//<span className="ms-2 fw-bold">{detailsSumTotal}</span>