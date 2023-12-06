import log from 'electron-log/main'


export default class LogMainHelper {
    private static _path: string

    private constructor() { }
    
    public static init() {
        log.transports.file.level = 'debug' // default: silly
        log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{processName}] [{level}] {text}'
        log.transports.console.level = 'debug' // default: silly
        log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{processName}] [{level}] {text}'
        log.variables.processName = 'main'

        log.initialize({ preload: true, spyRendererConsole: false })
        

        LogMainHelper._path = log.transports.file.getFile().path
        Object.assign(console, log.functions)
    }

    public static get path(): string {
        return LogMainHelper._path
    }
}