import React from 'react'
import { Button, Card, Col, Form, Row, Accordion } from 'react-bootstrap'
import { Formik } from 'formik';
import { coverageAreasDataMap } from '@shared/types/coverageAreaType';
import { diamondFormDataMap } from '@shared/types/diamondFormType';
import PictureI, { PictureDetailI, PictureISchema } from '@shared/interfaces/pictureI'
import PicturesDetailsTable from '@containers/picture/picture-details-table'
import FormField from '@components/form/form-field';
import FormFieldSelect from '@components/form/form-field-select';
import NumericPositiveDecimal2Format from '@components/inputs/numeric-positive-decimal2-format';
import IntPositiveFormat from '@components/inputs/int-positive-format';


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

    const detailsSumTotal = details.reduce((sum, pd) => sum + pd.price, 0)

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
                            <Form className="p-1">
                                <Row>
                                    <Col>
                                        <FormField
                                            name="id"
                                            prefixReactNode={<span>#</span>}
                                            addInputGroupText
                                            addHiddenInput
                                        />
                                    </Col>
                                    <Col sm="7">
                                        <FormField
                                            name="created"
                                            prefixReactNode={<span>Создана</span>}
                                            addInputGroupText
                                            addHiddenInput
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col></Col>
                                    <Col sm="7">
                                        <FormField
                                            name="updated"
                                            prefixReactNode={<span>Обновлена</span>}
                                            addInputGroupText
                                            addHiddenInput
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col>
                                        <FormField
                                            name="height"
                                            as={IntPositiveFormat}
                                            prefixReactNode={<span className="fw-bold">Высота</span>}
                                            addInputGroupInput
                                            postfixReactNode={<span className="fw-bold">см</span>}
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            name="width"
                                            as={IntPositiveFormat}
                                            prefixReactNode={<span className="fw-bold">Ширина</span>}
                                            addInputGroupInput
                                            postfixReactNode={<span className="fw-bold">см</span>}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-4">
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
                                <Row className="mb-4">
                                    <Col>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header className="fw-bold">Материалы картины</Accordion.Header>
                                                <Accordion.Body className="p-0">
                                                    <PicturesDetailsTable pictureDetails={details} onDetailsChenge={onDetailsChenger} />
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        <FormField
                                            className="mt-1 fw-bold"
                                            name="detailsSumTotal"
                                            as={NumericPositiveDecimal2Format}
                                            prefixReactNode={<span className="fw-bold">Всего за материалы</span>}
                                            addInputGroupText
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                            addHiddenInput
                                            value={detailsSumTotal}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormField
                                            name="pricePerHour"
                                            as={NumericPositiveDecimal2Format}
                                            prefixReactNode={<span>Цена за час</span>}
                                            addInputGroupInput
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                            inputPlaceholder="Введите цену за час"
                                        />
                                    </Col>
                                    <Col>
                                        <FormField
                                            name="hoursSpent"
                                            as={IntPositiveFormat}
                                            prefixReactNode={<span>Затрачено часов</span>}
                                            addInputGroupInput
                                            inputPlaceholder="Введите количество затрачено часов"
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col>
                                        <FormField
                                            className="fw-bold"
                                            name="forHoursSpentTotal"
                                            as={NumericPositiveDecimal2Format}
                                            prefixReactNode={<span className="fw-bold">Всего за потраченные часы</span>}
                                            addInputGroupText
                                            postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                            addHiddenInput
                                            value={values.pricePerHour * values.hoursSpent}
                                        />
                                    </Col>
                                </Row>
                                <FormField
                                    className="mb-4"
                                    as="textarea"
                                    name="comment"
                                    label="Коментарий"
                                    addInput
                                />
                                <Row className="mb-4">
                                    <Col>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header className="fw-bold">Рекомендуемая цена</Accordion.Header>
                                                <Accordion.Body className="p-0">
                                                <FormField
                                                        as={NumericPositiveDecimal2Format}
                                                        prefixReactNode={<span className="text-danger">Минимальная цена (за материалы)</span>}
                                                        addInputGroupText
                                                        inputGroupTextClassName="text-danger"
                                                        postfixReactNode={<i className="bi bi-currency-euro text-danger"></i>}
                                                        value={detailsSumTotal}
                                                    />
                                                     <FormField
                                                        as={NumericPositiveDecimal2Format}
                                                        prefixReactNode={<span className="text-danger">Минимальная цена (за работу)</span>}
                                                        addInputGroupText
                                                        inputGroupTextClassName="text-danger"
                                                        postfixReactNode={<i className="bi bi-currency-euro text-danger"></i>}
                                                        value={values.pricePerHour * values.hoursSpent}
                                                    />
                                                    <FormField
                                                        as={NumericPositiveDecimal2Format}
                                                        prefixReactNode={<span className="text-success">Цена (материалы + работа)</span>}
                                                        addInputGroupText
                                                        inputGroupTextClassName="text-success"
                                                        postfixReactNode={<i className="bi bi-currency-euro text-success"></i>}
                                                        value={detailsSumTotal + values.pricePerHour * values.hoursSpent}
                                                    />
                                                    <FormField
                                                        as={NumericPositiveDecimal2Format}
                                                        prefixReactNode={<span className="text-primary">Цена по формуле 1</span>}
                                                        addInputGroupText
                                                        inputGroupTextClassName="text-primary"
                                                        postfixReactNode={<i className="bi bi-currency-euro text-primary"></i>}
                                                        value={values.width * values.height * 0.014}
                                                    />
                                                    <FormField
                                                        as={NumericPositiveDecimal2Format}
                                                        prefixReactNode={<span className="text-primary">Цена по формуле 2</span>}
                                                        addInputGroupText
                                                        inputGroupTextClassName="text-primary"
                                                        postfixReactNode={<i className="bi bi-currency-euro text-primary"></i>}
                                                        value={values.width * values.height * 0.03}
                                                    />
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Col>
                                </Row>
                                <FormField
                                    name="bayFullPrice"
                                    as={NumericPositiveDecimal2Format}
                                    prefixReactNode={<span className="fw-bold">Продаю за</span>}
                                    addInputGroupInput
                                    postfixReactNode={<i className="bi bi-currency-euro"></i>}
                                    inputPlaceholder="Введите цену продажи"
                                />
                            </Form>
                            <Form.Group className="text-center pb-2">
                                <Button variant="primary" type="submit" className="me-3" onClick={submitForm}>Сохранить</Button >
                                {forAdd && <Button variant="secondary" className="me-3" onClick={handleReset}>Сброс</Button>}
                                <Button variant="secondary" className="me-3" onClick={props.onClose}>Закрыть</Button>
                            </Form.Group>
                        </>
                    )}
                </Formik>
            </Card >
        </>
    )
}