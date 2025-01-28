import BaseEntityI from '@dataAccess/entities/baseEntityI'


export default interface AppSettingsEntityI extends BaseEntityI {
    versions: {
        node: string
        chrome: string
        electron: string
    },
    paths: {
        logPath: string
        mainConfigPath: string
        projectPath: string
        pictureImagesPath: string
    }
}