import React, { useRef, useState } from 'react'
import { Button, Card, Col, Form, Row, Accordion, Image, ListGroup, Badge } from 'react-bootstrap'
import { Formik } from 'formik';
import ShortUniqueId from 'short-unique-id'
import { coverageAreasDataMap } from '@shared/types/coverageAreaType'
import { diamondFormDataMap } from '@shared/types/diamondFormType'
import PictureI, { pictureISchema } from '@shared/interfaces/pictureI'
import PictureDetailI from '@shared/interfaces/pictureDetailI'
import PicturesDetailsTable from '@containers/picture/picture-details-table'
import FormField from '@components/form/form-field'
import FormFieldSelect from '@components/form/form-field-select'
import NumericPositiveDecimal2Format from '@components/inputs/numeric-positive-decimal2-format'
import IntPositiveFormat from '@components/inputs/int-positive-format'
import ImageDropzone from '@components/image-dropzone'
import PictureImageI from '@shared/interfaces/pictureImageI'
import { ONE_MB_IN_BYTES } from '@shared/consts';


const uid = new ShortUniqueId({ length: 10 });

export default function PictureEdit(props: {
    data: PictureI,
    onSave: (data: PictureI) => void,
    onClose: () => void
}) {
    if (props === undefined) return null
    const forAdd = props.data.id === ''
    const initVal = props.data


    const [details, setDetails] = useState<PictureDetailI[]>(props.data.details)
    const detailsSumTotal = details.reduce((sum, pd) => sum + pd.price, 0)
    const onDetailsChenge = (details: PictureDetailI[]) => {
        setDetails(details)
    }

    const mainImageRef = useRef<HTMLImageElement>(null)
    const setMainImageSrc = (imgSrc: string | undefined) => {
        mainImageRef.current?.setAttribute('src', imgSrc ?? ' ')
        mainImageRef.current && setMainImageUpdated(true)
    }
    const [images, setImages] = useState<PictureImageI[]>(props.data.images)
    const [mainImageUpdated, setMainImageUpdated] = useState(false)
    const mainImg = images.find(i => i.isMain)
    mainImg && !mainImageUpdated && setMainImageSrc(URL.createObjectURL(mainImg.file))

    const onAddImage = (file: File) => {
        const fName = file.name
        setImages(prev => {
            const isMain = prev.length === 0
            isMain && setMainImageSrc(URL.createObjectURL(file))

            return [
                ...prev,
                {
                    id: uid.rnd(),
                    //получить расширение файла, если оно есть
                    ext: fName.indexOf('.') >= 0 ? fName.split('.').slice(-1)[0] : '',
                    size: file.size,
                    file: file,
                    isLoaded: false,
                    isMain

                } as PictureImageI
            ]
        })
    }

    const setMainImage = (e: React.MouseEvent, id: string) => {
        setImages(prev => {
            const newArr = [...prev]
            const oldMainImg = newArr.find(i => i.isMain)
            const newMainImg = newArr.find(i => i.id === id)

            oldMainImg && (oldMainImg.isMain = false)
            if (newMainImg) {
                newMainImg.isMain = true
                setMainImageSrc(URL.createObjectURL(newMainImg.file))
            }

            return newArr
        })
    }

    const removeImage = (e: React.MouseEvent, id: string) => {
        setImages(prev => {
            const isMainRemoved = prev.findIndex(i => i.id === id && i.isMain) >= 0
            const newArr = prev.filter(i => i.id !== id)

            if (isMainRemoved && newArr.length > 0) {
                newArr[0].isMain = true
                setMainImageSrc(URL.createObjectURL(newArr[0].file))
            } else if (isMainRemoved && newArr.length === 0) {
                setMainImageSrc(undefined)
            }

            return newArr
        })
    }



    return (
        <>
            <Card>
                <Formik initialValues={initVal}
                    validationSchema={pictureISchema}
                    enableReinitialize={true}
                    errors
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            setSubmitting(false)

                            values.details = details
                            values.images = images
                            props.onSave(values)
                        }, 400);
                    }}
                >
                    {({ values, errors, touched, handleReset, submitForm }) => (
                        <>
                            <div>
                                <div>
                                    {(!!Object.values(errors).length && !!Object.values(touched).length) &&
                                        <h6 className='text-danger m-1'>Исправьте ошибки</h6>
                                    }
                                </div>
                                <div>
                                    {/* вначале исключаем поля для которых ненужно отображать ошибки с верху
                                 (они уже отображаются возле полей ввода) */}
                                </div>
                                <div>
                                    {!!Object.values(errors).length &&
                                        Object.entries(errors)
                                            .filter(([key,]) => !['height', 'width', 'diamondForm', 'coverageArea',
                                                'detailsSumTotal', 'pricePerHour', 'hoursSpent', 'forHoursSpentTotal',
                                                'bayFullPrice', 'comment']
                                                .includes(key))
                                            .map(([, error]) => (
                                                <span className='text-danger d-inline-block'>{JSON.stringify(error)}</span>
                                            ))}
                                </div>
                            </div>
                            <Form className="p-1">
                                <Row>
                                    <Col>
                                        <Image ref={mainImageRef} className="bg-secondary" thumbnail width="150px" height="150px" />
                                    </Col>
                                    <Col sm="7">
                                        <FormField
                                            name="id"
                                            prefixReactNode={<span>#</span>}
                                            addInputGroupText
                                            addHiddenInput
                                        />
                                        <FormField
                                            name="created"
                                            prefixReactNode={<span>Создана</span>}
                                            addInputGroupText
                                            addHiddenInput
                                        />
                                        <FormField
                                            name="updated"
                                            prefixReactNode={<span>Обновлена</span>}
                                            addInputGroupText
                                            addHiddenInput
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <ImageDropzone className="my-1" onAddImage={onAddImage} />
                                        <ListGroup>
                                            {images.length > 0 && images.map(img => (
                                                <ListGroup.Item key={`img-${img.id}`} action variant="success">
                                                    <Card className='m-1' style={{ flexDirection: 'row' }}>
                                                        <Card.Img
                                                            style={{ maxWidth: "80px", maxHeight: "80px" }}
                                                            src={URL.createObjectURL(img.file)}
                                                        />
                                                        <ListGroup className="list-group-flush" style={{ width: "90%" }}>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col sm={10}>
                                                                        <span>Файл</span>
                                                                        {img.isLoaded && <Badge bg="success">загружен</Badge>}
                                                                        {!img.isLoaded && <Badge bg="warning" text="dark">готов к загрузке</Badge>}
                                                                        <span>: {img.isLoaded ? img.file.name : `${img.file.name} -&gt; ${img.id + '.' + img.ext}`}</span>
                                                                    </Col>
                                                                    <Col>
                                                                        <Button
                                                                            as="a"
                                                                            variant={img.isMain ? "outline-warning" : "outline-secondary"}
                                                                            size="sm"
                                                                            className={'ms-1 bi ' + (img.isMain ? 'bi-star-fill ' : 'bi-star-half ')}
                                                                            onClick={(e) => setMainImage(e, img.id)}
                                                                        >
                                                                        </Button>
                                                                        <Button
                                                                            as="a"
                                                                            variant="outline-danger"
                                                                            size="sm"
                                                                            className='ms-1 bi bi-trash3-fill'
                                                                            onClick={(e) => removeImage(e, img.id)}
                                                                        >
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>Размер: {(img.size / ONE_MB_IN_BYTES).toFixed(2)} Mb</ListGroup.Item>
                                                        </ListGroup>
                                                    </Card>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
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
                                                    <PicturesDetailsTable pictureDetails={details} onDetailsChenge={onDetailsChenge} />
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