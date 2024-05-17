import React from 'react'
import { Container } from 'react-bootstrap'


export default function Footer() {
    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-1 border-top mt-auto">
            <Container className="col-md-4 d-flex align-items-center">
                <span className="mb-3 mb-md-0 text-body-secondary">&copy; Торман Станислав, 2024</span>
            </Container>
        </footer>
    )
}