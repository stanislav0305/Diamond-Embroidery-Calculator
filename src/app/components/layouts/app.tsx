import React from 'react'
import { Container } from 'react-bootstrap'
import TitleBar from '@containers/title-bar'
import MainPage from '@components/pages/main-page'


export default function App() {
    return (
        <>
            <TitleBar></TitleBar>
            <Container>
                <MainPage></MainPage>
            </Container>
        </>
    )
}