
import React from 'react'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import PictureImageI from '@shared/interfaces/pictureImageI'
import { ONE_MB_IN_BYTES } from '@shared/consts';


interface PropsI {
    img: PictureImageI
    removeImage: (e: React.MouseEvent, id: string) => void
    setMainImage: (e: React.MouseEvent, id: string) => void
    createSrc: (pi: PictureImageI) => string
}

export default function PictureImageItem(props: PropsI) {
    const { img, setMainImage, removeImage, createSrc } = props
  
    return (
        <ListGroup.Item key={`img-${img.id}`} action variant="success">
            <Card className='m-1' style={{ flexDirection: 'row' }}>
                <Card.Img
                    style={{ maxWidth: "80px", maxHeight: "80px" }}
                    src={createSrc(img)}
                />
                <ListGroup className="list-group-flush" style={{ width: "90%" }}>
                    <ListGroup.Item>
                        <Row>
                            <Col sm={10}>
                                <span>Файл</span>
                                {img.isLoaded &&
                                    <Badge bg="success">загружен</Badge>
                                }
                                {!img.isLoaded &&
                                    <Badge bg="warning" text="dark">ожидает загрузку</Badge>
                                }
                                <span>: {
                                    img.isLoaded ?
                                        `${img.id}.${img.ext}`
                                        : `${img.name}.${img.ext} -&gt; ${img.id}.${img.ext}`
                                }</span>
                            </Col>
                            <Col>
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
                                key={`btn-remove-imagen-${img.id}`}
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
    )
}