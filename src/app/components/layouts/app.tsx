import React from 'react'
import { Button, Container, Stack } from 'react-bootstrap'
import TitleBar from '@containers/title-bar'


function App() {
    return (
        <>
            <TitleBar></TitleBar>
            <Container>
                <h1>Калькулятор алмазной вышевки</h1>
                <Stack direction="horizontal" gap={2}>
                    <Button as="a" variant="primary">
                        Button as link
                    </Button>
                    <Button as="a" variant="success">
                        Button as link
                    </Button>
                </Stack>
            </Container>
        </>
    )
}

export default App