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
                                <FormField
                                    className="mb-3"
                                    name="id"
                                    type="hidden"
                                    label="#"
                                    showValInSpan={true}
                                />
                                <Row>
                                    <Col>
                                        <FormField
                                            className="mb-3"
                                            name="height"
                                            type="number"
                                            label="Высота"
                                            placeholder="Введите высоту"
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            className="mb-3"
                                            name="width"
                                            type="number"
                                            label="Ширина"
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
                                        <PicturesDetailsTable pictureDetails={details} onDetailsChenge={setDetails} />
                                        <FormField
                                            className="mb-3"
                                            name="detailsSumTotal"
                                            type="hidden"
                                            label="Всего за материалы"
                                            showValInSpan={true}
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
                                <FormField
                                    className="mb-3"
                                    name="bayFullPrice"
                                    type="number"
                                    label="Продано за"
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
            </Card>
        </>
    )
}