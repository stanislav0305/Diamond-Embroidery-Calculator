export default interface AppSettingsI {
    appName: string,
    versions: {
        app: string
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