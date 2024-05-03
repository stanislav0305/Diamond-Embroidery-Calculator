import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import AppSettingsI from '@shared/interfaces/appSettingsI'

interface AppSettingsPropsI {
    appSettings: AppSettingsI | undefined
}

export default function AppSettings(props: AppSettingsPropsI | undefined) {
    if (props?.appSettings === undefined) return null

    const { appSettings } = props
    return (
        <>
            <Card>
                <ListGroup className='list-group-flush'>
                    <ListGroup.Item>
                        <label className='me-2'>Путь к логам:</label>
                        {appSettings.paths.logPath}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <label className='me-2'>Путь к mainConfig:</label>
                        {appSettings.paths.mainConfigPath}
                    </ListGroup.Item>
                </ListGroup>
            </Card>
            <Card className='mt-1'>
                <ListGroup className='list-group-flush'>
                    <ListGroup.Item>
                        <strong>Node v</strong>
                        {appSettings.versions.node}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Electron v</strong>
                        {appSettings.versions.electron}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Chrome v</strong>
                        {appSettings.versions.chrome}
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </>
    )
}