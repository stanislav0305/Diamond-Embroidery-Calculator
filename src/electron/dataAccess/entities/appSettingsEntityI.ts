import BasetEntityI from '@dataAccess/entities/baseEntityI'


export default interface AppSettingsEntityI extends BasetEntityI {
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