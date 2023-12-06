export default interface AppSettingsI {
    versions: {
        node: string,
        chrome: string,
        electron: string
    },
    paths: {
        logPath: string
    }
}