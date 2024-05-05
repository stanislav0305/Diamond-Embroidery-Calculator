import React, { useRef } from 'react'
import { Button, Container } from 'react-bootstrap'
import PicturesTable from '@containers/picture/pictures-table'
import PicturDetailsTableModal from '@containers/picture-details-default-set/pucture-details-table-modal'

export default function MainPage() {

    const picturDetailsTableModalRef = useRef<PicturDetailsTableModal>({} as PicturDetailsTableModal)
    const openPicturDetailsTableModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        picturDetailsTableModalRef.current.onOpen()
    }

    return (
        <Container className='position-relative'>
            <Button variant='primary' onClick={openPicturDetailsTableModal}>
                Материалы по умолчанию
            </Button>
            <PicturDetailsTableModal ref={picturDetailsTableModalRef} />
            <PicturesTable />
        </Container>
    )
}