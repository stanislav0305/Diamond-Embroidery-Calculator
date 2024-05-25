import React, { useCallback } from 'react'
import { Container, ListGroup } from 'react-bootstrap'
import { DropEvent, DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import { MAX_IMAGE_SIZE_IN_MB, ONE_MB_IN_BYTES } from '@shared/consts'


type Props = {
    className?: string
    onAddImage: (file: File, arrayBuffer: ArrayBuffer) => void
}

export default function ImageDropzone(props: Props) {
    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {

        acceptedFiles.forEach(file => {
            const reader = new FileReader()

            reader.onabort = () => console.warn(`File '${file.name}' reading was aborted !!!`)
            reader.onerror = () => console.warn(`File '${file.name}' reading has failed !!!`)
            reader.onload = () => {
                console.log(`File '${file.name}' onload...`)
                const arrayBuffer = reader.result as ArrayBuffer
                props.onAddImage(file, arrayBuffer)
            }

            reader.readAsArrayBuffer(file)
        })

    }, [])

    const { className } = props
    const { getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, fileRejections } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        minSize: 0,
        maxSize: MAX_IMAGE_SIZE_IN_MB * ONE_MB_IN_BYTES
    } as DropzoneOptions)

    return (
        <Container className={`text-center border p-0 ${className}`} >
            <div {...getRootProps()} className="p-4 d-block">
                <input {...getInputProps()} />
                {!isDragActive && <small className="text-muted small">Перетащите сюда несколько файлов или щелкните, чтобы выбрать файл(ы).</small>}
                {isDragActive && !isDragReject && <small className="text-success small">Теперь отпусти чтобы приложить файл(ы)!</small>}
                {isDragReject && <small className="text-danger small">Тип файла не принят! Можно загружать только изображения!</small>}
                <ListGroup>
                    {fileRejections.length > 0 && fileRejections.map(rejection => (
                        <ListGroup.Item key={`rejection-${rejection.file.name}`} action variant="danger">
                            <ListGroup.Item>Ошибка: {rejection.errors.map(error => error.message).join(', ')}</ListGroup.Item>
                            <ListGroup.Item>Файл: {rejection.file.name}</ListGroup.Item>
                            <ListGroup.Item>Размер: {(rejection.file.size / ONE_MB_IN_BYTES).toFixed(2)} Mb</ListGroup.Item>
                        </ListGroup.Item>

                    ))}
                </ListGroup>
            </div>
        </Container>
    )
}