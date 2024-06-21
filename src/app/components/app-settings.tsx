import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import { AppSettingsContextType } from '@contexts/app-settings-context'


interface PropsI {
    appSettingsContext: AppSettingsContextType
}

export default class AppSettings extends React.Component<PropsI, {}> {
    render() {
        const { appSettingsContext } = this.props
        const appSettings = appSettingsContext!.appSettings

        return (
            <>
                <Card>
                    <ListGroup className='list-group-flush'>
                        <ListGroup.Item>
                            <label className='me-2'>Путь к папке с проектом:</label>
                            {appSettings.paths.projectPath}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <label className='me-2'>Путь к папке с изображениями:</label>
                            {appSettings.paths.pictureImagesPath}
                        </ListGroup.Item>
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
                            <strong>{appSettings.appName} v</strong>
                            {appSettings.versions.app}
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
}