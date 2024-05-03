
import React, { ReactNode } from 'react'
import * as Yup from 'yup'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Formik, useField } from 'formik';
import { coverageAreaDefault, coverageAreas, coverageAreasDataMap } from '@shared/types/coverageAreaType';
import { diamondFormDefault, diamondForms, diamondFormDataMap } from '@shared/types/diamondFormType';
import PictureI from '@shared/interfaces/pictureI'


const PictureDetileISchema = Yup.object().shape({
    name: Yup.string()
        .required('Обязательное поле'),
    price: Yup.number()
        .required('Обязательное поле'),
})

const PictureISchema = Yup.object().shape({
    id: Yup.number()
        .required('Обязательное поле'),
    height: Yup.number()
        .min(10, 'Значение должно быть меньше или равно 10')
        .required('Обязательное поле'),
    width: Yup.number()
        .min(10, 'Значение должно быть меньше или равно 10')
        .required('Обязательное поле'),
    diamondForm: Yup.string()
        .oneOf(diamondForms)
        .default(diamondFormDefault)
        .required('Обязательное поле'),
    coverageArea: Yup.string()
        .oneOf(coverageAreas)
        .default(coverageAreaDefault)
        .required('Обязательное поле'),
    detiles: Yup.array()
        .of(PictureDetileISchema),
    detilesSumTotal: Yup.number()
        .required('Обязательное поле')
        .min(0, 'Значение должно быть меньше или равно 0'),
    pricePerHour: Yup.number()
        .min(0, 'Значение должно быть меньше или равно 0'),
    hoursSpent: Yup.number()
        .min(0, 'Значение должно быть меньше или равно 0'),
    bayFullPrice: Yup.number()
        .min(0, 'Значение должно быть меньше или равно 0')
        .required('Обязательное поле'),
    comment: Yup.string()
})

const pictureInitValues: PictureI = {
    id: 0,
    height: 0,
    width: 0,
    diamondForm: diamondFormDefault,
    coverageArea: coverageAreaDefault,
    detiles: [],
    detilesSumTotal: 0,
    pricePerHour: 0,
    hoursSpent: 0,
    bayFullPrice: 0,
    comment: ''
};

type FormFieldProps = React.HTMLAttributes<HTMLInputElement> & {
    name: string,
    type?: string,
    label: string,
    as?: React.ElementType,
    placeholder?: string,
    disabled?: boolean,
    showValInSpan?: boolean,
}


type optionsTypes = (typeof diamondFormDataMap | typeof coverageAreasDataMap)
type FormFieldSelectProps = React.HTMLAttributes<HTMLSelectElement> & {
    name: string,
    label: string,
    placeholder?: string,
    options: optionsTypes,
    disabled?: boolean,
}

const FormFieldSelect = ({ className, name, label, options, placeholder, ...props }: FormFieldSelectProps) => {
    const [field, meta] = useField(name)
    const isValid = meta.touched && meta.error === undefined;
    const isInvalid = meta.touched && meta.error !== undefined;


    const optionsObjs: ReactNode[] = [];
    options.forEach((value, key) =>
        optionsObjs.push(<option key={key} value={key}>{value}</option>)
    )

    return (
        <Form.Group className={className} controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Select
                size="sm"
                aria-label={label}
                name={name}
                {...props}
                value={field.value}
                isValid={isValid}
                isInvalid={isInvalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
            >
                {placeholder && <option>{placeholder}</option>}
                {optionsObjs}
            </Form.Select>
            {isInvalid && <Form.Text className="text-danger">{meta.error}</Form.Text>}
        </Form.Group>
    )
}

const FormField = ({ className, name, label, type, as, showValInSpan, ...props }: FormFieldProps) => {
    const [field, meta] = useField(name)
    const isValid = meta.touched && meta.error === undefined;
    const isInvalid = meta.touched && meta.error !== undefined;

    return (
        <Form.Group className={className} controlId={name}>
            <Form.Label>{label}</Form.Label>
            {showValInSpan && <span className='ms-2'>{field.value}</span>}
            <Form.Control
                size="sm"
                as={as}
                name={name}
                type={type}
                {...props}
                value={field.value}
                isValid={isValid}
                isInvalid={isInvalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
            />
            {isInvalid && <Form.Text className="text-danger">{meta.error}</Form.Text>}
        </Form.Group>
    )
}

export default function PictureEdit(props: { data: PictureI | null, onSave: (data: PictureI) => void, onClose: () => void }) {
    if (props === undefined) return null
    const forAdd = props.data === null
    const initVal = props.data ?? pictureInitValues

    return (
        <>
            <Card>
                <Formik initialValues={initVal}
                    validationSchema={PictureISchema}
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