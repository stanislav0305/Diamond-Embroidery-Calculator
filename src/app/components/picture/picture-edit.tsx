import React from 'react'
import { Button, Card, Col, Form, Row, Accordion, Image, ListGroup, InputGroup } from 'react-bootstrap'
import { Formik, FormikProps } from 'formik'
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
import PictureImageItem from '@components/picture/picture-image-item'
import { EventMessagesContext } from '@contexts/event-messages-provider'
import PictureHoursSpentCalculatorModal from '@containers/picture/picture-hours-spent-calculator-modal'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { ColumnOrderState, SortingState, Updater, VisibilityState } from '@tanstack/react-table'
import { ColumnSortI } from '@shared/interfaces/columnSortI'
import SimilarPicturesModal from '@containers/picture/similar-pictures-modal'
import { ComponentModeType } from '@utils/types/componentModeType'
import SimilarPicturesFilterI from '@shared/classes/similarPicturesFilter'
import { CurrencyContext } from '@contexts/currency-context-provider'
import { CurrencyI } from '@shared/interfaces/currencyI'


const uid = new ShortUniqueId({ length: 10 })

interface PropsI {
    componentMode?: ComponentModeType
    data: PictureI
    pictureImagesPath: string
    onSave: (data: PictureI) => void
    onClose: () => void
}

interface StateI {
    forAdd: boolean
    initVal: PictureI
    details: PictureDetailI[]
    detailsTableOptions: TableOptionsI,
    images: PictureImageI[]
    mainImageSrc: string | undefined
}

export default class PictureEdit extends React.Component<PropsI, StateI> {
    static contextType = EventMessagesContext
    static defaultProps = {
        componentMode: 'default',
    }
    context!: React.ContextType<typeof EventMessagesContext>
    pictureHoursSpentCalculatorModalRef = React.createRef<PictureHoursSpentCalculatorModal>()
    similarPicturesModalRef = React.createRef<SimilarPicturesModal>()
    formicRef = React.createRef<FormikProps<PictureI>>()
    objectURLsMap: Map<string, string> = new Map<string, string>()

    constructor(props: PropsI) {
        super(props)

        let { data } = this.props
        data = JSON.parse(JSON.stringify(data)) as PictureI

        const mainImg = data.images.find(i => i.isMain)

        this.state = {
            forAdd: data.id === '',
            initVal: data,
            details: data.details,
            detailsTableOptions: {
                columnVisibility: {},
                columnOrder: [],
                columnSort: [],
            } as TableOptionsI,
            images: data.images,
            mainImageSrc: this.createSrc(mainImg)
        }
    }

    componentDidMount() {
        window.api.pictureDetail.tableOptions.get()
            .then((opts: TableOptionsI) => {
                this.setState(prev => {
                    return {
                        ...prev,
                        detailsTableOptions: {
                            ...opts
                        },
                    }
                })
            })

        window.api.pictures.images.on.dowloaded((_event, result: boolean) => {
            const hasErroror = !result
            this.context.addMessage(
                'PictureFilesDonwnloaded',
                hasErroror
            )
        })

        window.api.currency.on.currencyChenged((_event, currency: CurrencyI) => {
            //refresh details table if changed currency simbol
            this.setState(prev => {
                return {
                    ...prev,
                    details: [...prev.details]
                }
            })
        })
    }

    componentWillUnmount() {
        this.removeAllObjectURLs()
        window.api.pictures.images.off.dowloaded()
        window.api.currency.off.currencyChenged()
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

    onColumnVisibilityChange = (updater: Updater<VisibilityState>) => {
        this.setState(prev => {
            const model = (updater instanceof Function ? updater(prev.detailsTableOptions.columnVisibility) : updater) as object
            window.api.pictureDetail.tableOptions.setColumnVisibility(model)

            return {
                ...prev,
                detailsTableOptions: {
                    ...prev.detailsTableOptions,
                    columnVisibility: model
                }
            }
        })

    }

    onColumnOrderChange = (updater: Updater<ColumnOrderState>) => {
        this.setState(prev => {
            const model = (updater instanceof Function ? updater(prev.detailsTableOptions.columnOrder) : updater) as string[]

            if (prev.detailsTableOptions.columnOrder && model
                && prev.detailsTableOptions.columnOrder.length > 0 && model.length > 0
                && model.filter((item, index) => { return prev.detailsTableOptions.columnOrder[index] !== item }).length > 0) {
                //save only if arrays are defferent
                window.api.pictureDetail.tableOptions.setColumnOrder(model)
            }

            return {
                ...prev,
                detailsTableOptions: {
                    ...prev.detailsTableOptions,
                    columnOrder: model
                }
            }
        })
    }

    onSortingChange = (updater: Updater<SortingState>) => {
        this.setState(prev => {
            const model = (updater instanceof Function ? updater(prev.detailsTableOptions.columnSort) : updater) as ColumnSortI[]

            if (prev.detailsTableOptions.columnSort && model
                && ((prev.detailsTableOptions.columnSort.length !== model.length)
                    || (model.filter((item, index) => {
                        return prev.detailsTableOptions.columnSort[index].id !== item.id
                            || prev.detailsTableOptions.columnSort[index].desc !== item.desc
                    }).length > 0))) {
                //save only if arrays are defferent
                window.api.pictureDetail.tableOptions.setColumnSort(model)

            }

            return {
                ...prev,
                detailsTableOptions: {
                    ...prev.detailsTableOptions,
                    columnSort: model
                }
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
            //get the file name if it exists
            name: file.name.indexOf('.') >= 0 ? file.name.split('.').slice(-1)[1] : '',
            type: file.type,
            //get the file extension if it exists
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

    downloadImage = (e: React.MouseEvent, fileName: string) => {
        e.preventDefault()
        window.api.pictures.images.download(fileName)
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

    //---------------------------------------------------------------

    openPictureHoursSpentCalculatorModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, hoursSpent: number) => {
        e.preventDefault()
        this.pictureHoursSpentCalculatorModalRef.current!.onOpen(hoursSpent)
    }

    onSaveHoursSpentCalculator = (hoursSpent: number) => {
        this.formicRef.current!.setFieldValue('hoursSpent', hoursSpent)
    }

    //---------------------------------------------------------------

    openSimilarPicturesModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: PictureI) => {
        e.preventDefault()

        const filter = new SimilarPicturesFilterI(values)
        this.similarPicturesModalRef.current!.onOpen(filter)
    }

    //---------------------------------------------------------------

    render() {
        const { componentMode } = this.props
        const { forAdd, initVal, details, detailsTableOptions, images, mainImageSrc } = this.state
        const detailsSumTotal = details.reduce((sum, pd) => sum + pd.price, 0)

        return (
            <>
                <CurrencyContext.Consumer>
                    {(currencyContext) => (
                        <Card>
                            <Formik innerRef={this.formicRef}
                                initialValues={initVal}
                                validationSchema={pictureISchema}
                                enableReinitialize={true}
                                errors
                                onSubmit={(values, { setSubmitting }) => {
                                    setTimeout(() => {
                                        setSubmitting(false)

                                        values.details = details
                                        values.images = images
                                        this.props.onSave(values)
                                    }, 400)
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
                                                    /* First, we exclude fields for which it is unnecessary to display errors at the top 
                                                    (they are already displayed near the input fields) */
                                                    .filter(([key,]) => !['height', 'width', 'diamondForm', 'coverageArea',
                                                        'detailsSumTotal', 'pricePerHour', 'hoursSpent', 'forHoursSpentTotal',
                                                        'bayFullPrice', 'comment']
                                                        .includes(key))
                                                    .map(([, error]) => (
                                                        <span className='text-danger d-inline-block'>{JSON.stringify(error)}</span>
                                                    ))}
                                        </div>
                                        <Form className="p-1">
                                            <Row className="mb-4">
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
                                                        prefixReactNode={<InputGroup.Text className="p-1">#</InputGroup.Text>}
                                                        addInputGroupText
                                                        addHiddenInput
                                                    />
                                                    <FormField
                                                        name="created"
                                                        prefixReactNode={<InputGroup.Text className="p-1">Создана</InputGroup.Text>}
                                                        addInputGroupText
                                                        addHiddenInput
                                                    />
                                                    <FormField
                                                        name="updated"
                                                        prefixReactNode={<InputGroup.Text className="p-1">Обновлена</InputGroup.Text>}
                                                        addInputGroupText
                                                        addHiddenInput
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col>
                                                    {componentMode === 'default' &&
                                                        <ImageDropzone className="my-1" onAddImage={this.onAddImage} />
                                                    }
                                                    <ListGroup as="ul">
                                                        {images.length > 0 && images.map(img => (
                                                            <PictureImageItem
                                                                componentMode={componentMode}
                                                                key={img.id}
                                                                img={img}
                                                                createSrc={this.createSrc}
                                                                downloadImage={this.downloadImage}
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
                                                        prefixReactNode={<InputGroup.Text className="p-1">Высота</InputGroup.Text>}
                                                        addInputGroupInput={componentMode === 'default'}
                                                        addInputGroupText={componentMode === 'readonly'}
                                                        postfixReactNode={
                                                            <InputGroup.Text className="p-1">см</InputGroup.Text>
                                                        }
                                                    />
                                                </Col>
                                                <Col>
                                                    <FormField
                                                        name="width"
                                                        as={IntPositiveFormat}
                                                        prefixReactNode={<InputGroup.Text className="p-1">Ширина</InputGroup.Text>}
                                                        addInputGroupInput={componentMode === 'default'}
                                                        addInputGroupText={componentMode === 'readonly'}
                                                        postfixReactNode={
                                                            <InputGroup.Text className="p-1">см</InputGroup.Text>
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col>
                                                    <FormFieldSelect
                                                        name="diamondForm"
                                                        label="Форма кристала"
                                                        options={diamondFormDataMap}
                                                        disabled={componentMode === 'readonly'}
                                                    />
                                                </Col>
                                                <Col>
                                                    <FormFieldSelect
                                                        name="coverageArea"
                                                        label="Площадь покрытия"
                                                        options={coverageAreasDataMap}
                                                        disabled={componentMode === 'readonly'}
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
                                                            <Accordion.Body className="p-1">
                                                                <PicturesDetailsTable
                                                                    componentMode={componentMode}
                                                                    pictureDetails={details}
                                                                    currencyHtmlCode={currencyContext.currencyHtmlCode}
                                                                    onDetailsChenge={this.onDetailsChenge}
                                                                    tableOptions={detailsTableOptions}
                                                                    onColumnVisibilityChange={this.onColumnVisibilityChange}
                                                                    onColumnOrderChange={this.onColumnOrderChange}
                                                                    onSortingChange={this.onSortingChange}
                                                                />
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                    <FormField
                                                        className="mt-1 fw-bold input-group-bg-primary"
                                                        name="detailsSumTotal"
                                                        as={NumericPositiveDecimal2Format}
                                                        prefixReactNode={
                                                            <InputGroup.Text className="p-1 fw-bold">
                                                                Всего за материалы
                                                            </InputGroup.Text>
                                                        }
                                                        addInputGroupInput={componentMode === 'default'}
                                                        addInputGroupText={componentMode === 'readonly'}
                                                        postfixReactNode={
                                                            <InputGroup.Text className="p-1">
                                                                {currencyContext.currencyHtmlCode}
                                                            </InputGroup.Text>
                                                        }
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
                                                        prefixReactNode={<InputGroup.Text className="p-1">Цена за час</InputGroup.Text>}
                                                        addInputGroupInput={componentMode === 'default'}
                                                        addInputGroupText={componentMode === 'readonly'}
                                                        postfixReactNode={
                                                            <InputGroup.Text className="p-1">
                                                                {currencyContext.currencyHtmlCode}
                                                            </InputGroup.Text>
                                                        }
                                                        inputPlaceholder="Введите цену за час"
                                                    />
                                                </Col>
                                                <Col className="text-end">
                                                    <FormField
                                                        className="d-inline-block"
                                                        name="hoursSpent"
                                                        as={IntPositiveFormat}
                                                        prefixReactNode={<InputGroup.Text className="p-1">Затрачено часов</InputGroup.Text>}
                                                        addInputGroupInput={componentMode === 'default'}
                                                        addInputGroupText={componentMode === 'readonly'}
                                                        inputPlaceholder="Введите количество затрачено часов"
                                                        postfixReactNode={
                                                            componentMode === 'default' && (
                                                                <Button
                                                                    as="a"
                                                                    variant="outline-warning"
                                                                    size="sm"
                                                                    className="d-inline-block bi bi-calculator-fill"
                                                                    onClick={(e) => this.openPictureHoursSpentCalculatorModal(e, values.hoursSpent)}
                                                                >
                                                                    Посчитать время
                                                                </Button>
                                                            )
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col>
                                                    <FormField
                                                        className="fw-bold"
                                                        name="forHoursSpentTotal"
                                                        as={NumericPositiveDecimal2Format}
                                                        prefixReactNode={
                                                            <InputGroup.Text className="p-1 fw-bold">
                                                                Всего за потраченные часы
                                                            </InputGroup.Text>
                                                        }
                                                        addInputGroupText
                                                        postfixReactNode={
                                                            <InputGroup.Text className="p-1">
                                                                {currencyContext.currencyHtmlCode}
                                                            </InputGroup.Text>
                                                        }
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
                                                disabled={componentMode === 'readonly'}
                                            />
                                            <Row className="mb-4">
                                                <Col>
                                                    <Accordion>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header className="fw-bold">Рекомендуемая цена</Accordion.Header>
                                                            <Accordion.Body className="p-1">
                                                                <FormField
                                                                    as={NumericPositiveDecimal2Format}
                                                                    prefixReactNode={
                                                                        <InputGroup.Text className="p-1 text-danger">
                                                                            Минимальная цена (за материалы)
                                                                        </InputGroup.Text>
                                                                    }
                                                                    addInputGroupText
                                                                    inputGroupValueClassName="text-danger"
                                                                    postfixReactNode={
                                                                        <InputGroup.Text className="p-1 text-danger">
                                                                            {currencyContext.currencyHtmlCode}
                                                                        </InputGroup.Text>
                                                                    }
                                                                    value={detailsSumTotal}
                                                                />
                                                                <FormField
                                                                    as={NumericPositiveDecimal2Format}
                                                                    prefixReactNode={
                                                                        <InputGroup.Text className="p-1 text-danger">
                                                                            Минимальная цена (за работу)
                                                                        </InputGroup.Text>
                                                                    }
                                                                    addInputGroupText
                                                                    inputGroupValueClassName="text-danger"
                                                                    postfixReactNode={
                                                                        <InputGroup.Text className="p-1 text-danger">
                                                                            {currencyContext.currencyHtmlCode}
                                                                        </InputGroup.Text>
                                                                    }
                                                                    value={values.pricePerHour * values.hoursSpent}
                                                                />
                                                                <FormField
                                                                    as={NumericPositiveDecimal2Format}
                                                                    prefixReactNode={
                                                                        <InputGroup.Text className="p-1 text-success">
                                                                            Цена (материалы + работа)
                                                                        </InputGroup.Text>
                                                                    }
                                                                    addInputGroupText
                                                                    inputGroupValueClassName="text-success"
                                                                    postfixReactNode={
                                                                        <InputGroup.Text className="p-1 text-success">
                                                                            {currencyContext.currencyHtmlCode}
                                                                        </InputGroup.Text>
                                                                    }
                                                                    value={detailsSumTotal + values.pricePerHour * values.hoursSpent}
                                                                />
                                                                {componentMode === 'default' &&
                                                                    <Button
                                                                        as="a"
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        className="d-inline-block bi bi-eye-fill"
                                                                        onClick={(e) => this.openSimilarPicturesModal(e, values)}
                                                                    >
                                                                        Показать похожие картины
                                                                    </Button>
                                                                }
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                </Col>
                                            </Row>
                                            <FormField
                                                name="bayFullPrice"
                                                inputClassName="fw-bold"
                                                as={NumericPositiveDecimal2Format}
                                                prefixReactNode={
                                                    <InputGroup.Text className="p-1 fw-bold">
                                                        Продаю за
                                                    </InputGroup.Text>
                                                }
                                                addInputGroupInput={componentMode === 'default'}
                                                addInputGroupText={componentMode === 'readonly'}
                                                postfixReactNode={
                                                    <InputGroup.Text className="p-1">
                                                        {currencyContext.currencyHtmlCode}
                                                    </InputGroup.Text>
                                                }
                                                inputPlaceholder="Введите цену продажи"
                                            />
                                        </Form>
                                        <Form.Group className="text-center pb-2">
                                            {componentMode === 'default' &&
                                                <>
                                                    <Button variant="primary" type="submit" className="me-3" onClick={submitForm}>Сохранить</Button >
                                                    {forAdd && <Button variant="secondary" className="me-3" onClick={handleReset}>Сброс</Button>}
                                                </>
                                            }
                                            <Button variant="secondary" className="me-3" onClick={this.props.onClose}>Закрыть</Button>
                                        </Form.Group>
                                    </>
                                )}
                            </Formik>
                        </Card >
                    )}
                </CurrencyContext.Consumer>
                <PictureHoursSpentCalculatorModal ref={this.pictureHoursSpentCalculatorModalRef} onSaved={this.onSaveHoursSpentCalculator} />
                <SimilarPicturesModal ref={this.similarPicturesModalRef} />
            </>
        )
    }
}