import log from 'electron-log/renderer'


export default class LogRendererHelper {
    public static init() {
        log.transports.console.level = 'debug' // default: silly
        log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
        log.variables.processName = 'renderer'

        Object.assign(console, log.functions)
    }
}