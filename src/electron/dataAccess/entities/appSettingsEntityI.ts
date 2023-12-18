export interface AppSettingsEntityI {
    versions: {
        node: string
        chrome: string
        electron: string
    },
    paths: {
        logPath: string
        mainConfigPath: string
    }
}