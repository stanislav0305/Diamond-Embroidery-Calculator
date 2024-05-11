import React, { useCallback } from 'react'
import { Container, ListGroup } from 'react-bootstrap'
import { DropEvent, DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import { MAX_IMAGE_SIZE_IN_MB, ONE_MB_IN_BYTES } from '@shared/consts'


type Props = {
    className?: string,
    onAddImage: (file: File) => void
}

export default function ImageDropzone(props: Props) {
    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {

        acceptedFiles.forEach(file => {
            const reader = new FileReader()

            reader.onabort = () => console.warn('File reading was aborted !!!')
            reader.onerror = () => console.warn('File reading has failed !!!')
            reader.onload = () => {
                console.log('File onload...')
                props.onAddImage(file)
                //const binaryStr = reader.result
                //console.log(binaryStr)
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
        <Container className={`text-center border p-1 ${className}`} >
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {!isDragActive && <p className="text-muted">Перетащите сюда несколько файлов или щелкните, чтобы выбрать файлы.</p>}
                {isDragActive && !isDragReject && <p className="text-success">Теперь отпусти чтобы загрузить!</p>}
                {isDragReject && <p className="text-danger">Тип файла не принят! Можно загружать только изображения!</p>}
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