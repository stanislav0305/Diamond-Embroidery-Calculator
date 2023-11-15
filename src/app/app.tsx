import React from 'react'
import { Button, Stack } from 'react-bootstrap'

import './app.scss'

function App() {
    return (
        <div>
            <h1>Hello, Electron and React!</h1>
            <Stack direction="horizontal" gap={2}>
                <Button as="a" variant="primary">
                    Button as link
                </Button>
                <Button as="a" variant="success">
                    Button as link
                </Button>
            </Stack>
        </div>
    );
}

export default App