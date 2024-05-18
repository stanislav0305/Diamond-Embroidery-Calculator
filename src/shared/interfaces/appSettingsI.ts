export default interface AppSettingsI {
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