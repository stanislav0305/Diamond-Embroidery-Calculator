import React from 'react'
import { Container } from 'react-bootstrap'
import PicturesTable from '@containers/picture/pictures-table'


export default function MainPage() {
    return (
        <div className='position-relative m-1'>
            <PicturesTable />
        </div>
    )
}