import React from 'react'
import { Button, Stack } from 'react-bootstrap'


export default function MainPage() {
    return (
        <Stack direction="horizontal" gap={2}>
            <Button as="a" variant="primary">Добавить</Button>
        </Stack>
    )
}