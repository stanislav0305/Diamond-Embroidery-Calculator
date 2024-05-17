import React, { useRef } from 'react'
import { Button, Container } from 'react-bootstrap'
import PicturesTable from '@containers/picture/pictures-table'
import PictureDefaultSetModal from '@containers/picture/picture-default-set-modal'

export default function MainPage() {

    const pictureDetailsDefaultSetModalRef = useRef<PictureDefaultSetModal>({} as PictureDefaultSetModal)
    const openPicturDetailsTableModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        pictureDetailsDefaultSetModalRef.current.onOpen()
    }

    return (
        <Container className='position-relative'>
            <Button variant='primary' onClick={openPicturDetailsTableModal}>
                Данные по умолчанию
            </Button>
            <PictureDefaultSetModal ref={pictureDetailsDefaultSetModalRef} />
            <PicturesTable />
        </Container>
    )
}