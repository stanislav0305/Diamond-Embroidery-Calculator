import React from 'react'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import PictureImageI from '@shared/interfaces/pictureImageI'
import { ONE_MB_IN_BYTES } from '@shared/consts'
import { ComponentModeType } from '@utils/types/componentModeType'


interface PropsI {
    componentMode?: ComponentModeType
    img: PictureImageI
    removeImage: (e: React.MouseEvent, id: string) => void
    setMainImage: (e: React.MouseEvent, id: string) => void
    downloadImage: (e: React.MouseEvent, id: string) => void
    createSrc: (pi: PictureImageI) => string
}

export default function PictureImageItem(props: PropsI) {
    const { componentMode = 'default', img, setMainImage, removeImage, downloadImage, createSrc } = props

    return (
        <ListGroup.Item as="li" key={`img-${img.id}`} action variant="success">
            <Card className='m-1' style={{ flexDirection: 'row' }}>
                <Card.Img
                    style={{ maxWidth: "82px", maxHeight: "82px" }}
                    className='m-1'
                    src={createSrc(img)}
                />
                <ListGroup as="ul" className="list-group-flush" style={{ width: "90%" }}>
                    <ListGroup.Item as="li">
                        <Row>
                            <Col sm={9}>
                                <span>Файл</span>
                                <span>: {
                                    img.isLoaded ?
                                        `${img.id}.${img.ext}`
                                        : `${img.name}.${img.ext} -&gt; ${img.id}.${img.ext}`
                                }</span>
                            </Col>
                            <Col className='text-end'>
                                {(img.isLoaded && componentMode === 'default') &&
                                    <Button
                                        key={`btn-download-${img.id}`}
                                        as="a"
                                        variant="outline-secondary"
                                        size="sm"
                                        className="ms-1 bi bi-download"
                                        onClick={(e) => downloadImage(e, `${img.id}.${img.ext}`)}
                                    >
                                    </Button>
                                }
                                {componentMode === 'default' &&
                                    <>
                                        <Button
                                            key={`btn-set-main-image-${img.id}`}
                                            as="a"
                                            variant={img.isMain ? "outline-warning" : "outline-secondary"}
                                            size="sm"
                                            className={'ms-1 bi ' + (img.isMain ? 'bi-star-fill ' : 'bi-star-half ')}
                                            onClick={(e) => setMainImage(e, img.id)}
                                        >
                                        </Button>
                                        <Button
                                            key={`btn-remove-image-${img.id}`}
                                            as="a"
                                            variant="outline-danger"
                                            size="sm"
                                            className='ms-1 bi bi-trash3-fill'
                                            onClick={(e) => removeImage(e, img.id)}
                                        >
                                        </Button>
                                    </>
                                }
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item as="li">
                        {img.isLoaded &&
                            <Badge bg="success" className='me-1'>загружен</Badge>
                        }
                        {!img.isLoaded &&
                            <Badge bg="warning" text="dark" className='me-1'>ожидает загрузку</Badge>
                        }
                        <span>Размер: {(img.size / ONE_MB_IN_BYTES).toFixed(2)} Mb</span>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </ListGroup.Item>
    )
}