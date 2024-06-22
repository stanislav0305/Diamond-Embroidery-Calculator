import { BrowserWindow, dialog } from 'electron'
import { ICON_PATH, PRELOAD_JS_PATH, INDEX_HTML_PATH, IS_DEV } from '@general/consts'
import { DialogHelper, ShowOpenDialogPropertiesType } from '@mainUtils/helpers/dialogHelper'


const defaultProps: Electron.BrowserWindowConstructorOptions = {
    height: 600,
    width: 800,
    frame: false,
    icon: ICON_PATH,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
    }
}

abstract class BaseWindow {
    protected _window: BrowserWindow

    constructor(filePath: string, options: Electron.BrowserWindowConstructorOptions) {
        console.log('window creating...')
        this._window = new BrowserWindow({
            ...defaultProps,
            ...options
        })

        if (IS_DEV) {
            this._window.webContents.openDevTools()
        }

        this._window.loadFile(filePath)
    }

    public getBrowserWindow(): BrowserWindow {
        return this._window
    }

    public showOpenDialog(properties?: ShowOpenDialogPropertiesType)
        : Promise<Electron.OpenDialogReturnValue> {

        return DialogHelper.showOpenDialog(this._window, properties)
    }

    public maximize() {
        this._window.maximize()
    }

    public unmaximize() {
        this._window.unmaximize()
    }

    public minimize() {
        this._window.minimize()
    }
}

export default class MainWindow extends BaseWindow {
    constructor() {
        super(INDEX_HTML_PATH, {
            webPreferences: {
                preload: PRELOAD_JS_PATH
            }
        })

        this._window.on('unmaximize', () => this.onUnmaximize)
    }

    private onUnmaximize() {
        this._window.webContents.send('unmaximized')
    }
}