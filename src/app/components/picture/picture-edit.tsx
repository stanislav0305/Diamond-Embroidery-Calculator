import React from 'react'
import { Button, Card, Col, Form, Row, Accordion, Image, ListGroup } from 'react-bootstrap'
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
import PictureImageItem from '@components/picture/picture-image-item';


const uid = new ShortUniqueId({ length: 10 });

interface Props {
    data: PictureI,
    pictureImagesPath: string,
    onSave: (data: PictureI) => void,
    onClose: () => void
}

interface State {
    forAdd: boolean,
    initVal: PictureI,
    details: PictureDetailI[]
    images: PictureImageI[]
    mainImageSrc: string | undefined
}

export default class PictureEdit extends React.Component<Props, State> {
    objectURLsMap: Map<string, string> = new Map<string, string>()

    constructor(props: Props) {
        super(props)

        let  { data } = this.props
        data = JSON.parse(JSON.stringify(data)) as PictureI

        const mainImg = data.images.find(i => i.isMain)

        this.state = {
            forAdd: data.id === '',
            initVal: data,
            details: data.details,
            images: data.images,
            mainImageSrc: this.createSrc(mainImg)
        }
    }

    componentWillUnmount = () => {
        this.removeAllObjectURLs()
    }

    onDetailsChenge = (details: PictureDetailI[]) => {
        this.setState(prev => {
            return {
                ...prev,
                details
            }
        })
    }

    //---------------------------------------------------------------

    createSrc = (pi: PictureImageI | undefined): string => {
        let src = ' '

        if (pi && !pi.isLoaded) {
            const blob = new Blob([pi.arrayBuffer])
            src = URL.createObjectURL(blob)
            this.objectURLsMap.set(pi.id, src)
        } else if (pi && pi.isLoaded) {
            const { pictureImagesPath } = this.props
            src = `${pictureImagesPath}/${pi?.id}.${pi?.ext}`
        }

        return src
    }

    removeObjectURL = (pictureImageId: string) => {
        const objectURL = this.objectURLsMap.get(pictureImageId)!

        URL.revokeObjectURL(objectURL)
        this.objectURLsMap.delete(pictureImageId)
    }

    removeAllObjectURLs = () => {
        const keys = [...Object.keys(this.objectURLsMap)]
        keys.forEach(key => {
            this.removeObjectURL(key)
        })
    }

    //---------------------------------------------------------------
    
    createPictereImage = (file: File, arrayBuffer: ArrayBuffer, isMain: boolean) => {
        return {
            id: uid.rnd(),
            //получить название файла, если оно есть
            name: file.name.indexOf('.') >= 0 ? file.name.split('.').slice(-1)[1] : '',
            type: file.type,
            //получить расширение файла, если оно есть
            ext: file.name.indexOf('.') >= 0 ? file.name.split('.').slice(-1)[0] : '',
            size: file.size,
            isMain,
            isLoaded: false,
            arrayBuffer
        } as PictureImageI
    }

    onAddImage = async (file: File, arrayBuffer: ArrayBuffer) => {
        this.setState(prev => {
            const isMain = prev.images.length === 0
            const newImg = this.createPictereImage(file, arrayBuffer, isMain)

            return {
                ...prev,
                images: [...prev.images, newImg],
                mainImageSrc: isMain ? this.createSrc(newImg) : prev.mainImageSrc
            }
        })
    }

    setMainImage = (e: React.MouseEvent, id: string) => {
        this.setState(prev => {
            const newImages = [...prev.images]
            const oldMainImg = newImages.find(i => i.isMain)
            const newMainImg = newImages.find(i => i.id === id)

            oldMainImg && (oldMainImg.isMain = false)
            newMainImg && (newMainImg.isMain = true)

            return {
                ...prev,
                images: newImages,
                mainImageSrc: newMainImg ? this.createSrc(newMainImg) : prev.mainImageSrc
            }
        })
    }

    removeImage = (e: React.MouseEvent, id: string) => {
        this.setState(prev => {
            const isMainRemoved = prev.images.find(i => i.id === id && i.isMain)
            const newImages = [...prev.images.filter(i => i.id !== id)]

            if (!!isMainRemoved && !isMainRemoved.isLoaded) {
                this.removeObjectURL(isMainRemoved.id)
            }

            let mainImageSrc
            if (!!isMainRemoved && newImages.length > 0) {
                newImages[0].isMain = true
                mainImageSrc = this.createSrc(newImages[0])
            } else if (!!isMainRemoved && newImages.length === 0) {
                mainImageSrc = ' '
            } else if (!isMainRemoved) {
                mainImageSrc = prev.mainImageSrc
            }

            return {
                ...prev,
                images: newImages,
                mainImageSrc
            }
        })
    }

    render() {
        const { forAdd, initVal, details, images, mainImageSrc } = this.state
        const detailsSumTotal = details.reduce((sum, pd) => sum + pd.price, 0)

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
                                this.props.onSave(values)
                            }, 400);
                        }}
                    >
                        {({ values, errors, touched, handleReset, submitForm }) => (
                            <>
                                <div>
                                    {(!!Object.values(errors).length && !!Object.values(touched).length) &&
                                        <h6 className='text-danger m-1 fw-bold'>Исправьте ошибки</h6>
                                    }
                                    {!!Object.values(errors).length &&
                                        Object.entries(errors)
                                            /* вначале исключаем поля для которых ненужно отображать ошибки с верху 
                                            (они уже отображаются возле полей ввода) */
                                            .filter(([key,]) => !['height', 'width', 'diamondForm', 'coverageArea',
                                                'detailsSumTotal', 'pricePerHour', 'hoursSpent', 'forHoursSpentTotal',
                                                'bayFullPrice', 'comment']
                                                .includes(key))
                                            .map(([, error]) => (
                                                <span className='text-danger d-inline-block'>{JSON.stringify(error)}</span>
                                            ))}
                                </div>
                                <Form className="p-1">
                                    <Row>
                                        <Col>
                                            <Image
                                                className="bg-secondary"
                                                thumbnail
                                                width="150px"
                                                height="150px"
                                                src={mainImageSrc}
                                            />
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
                                            <ImageDropzone className="my-1" onAddImage={this.onAddImage} />
                                            <ListGroup as="ul">
                                                {images.length > 0 && images.map(img => (
                                                    <PictureImageItem
                                                        key={img.id}
                                                        img={img}
                                                        createSrc={this.createSrc}
                                                        setMainImage={this.setMainImage}
                                                        removeImage={this.removeImage}
                                                    />
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
                                                    <Accordion.Header className="fw-bold">
                                                        Материалы картины
                                                    </Accordion.Header>
                                                    <Accordion.Body className="p-0">
                                                        <PicturesDetailsTable
                                                            pictureDetails={details}
                                                            onDetailsChenge={this.onDetailsChenge}
                                                        />
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
                                    <Button variant="secondary" className="me-3" onClick={this.props.onClose}>Закрыть</Button>
                                </Form.Group>
                            </>
                        )}
                    </Formik>
                </Card >
            </>
        )
    }
}