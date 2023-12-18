import { BrowserWindow } from 'electron'
import { iconPath, preloadJsPath, indexHtmlPath, isDev } from '@general/constst'


const defaultProps: Electron.BrowserWindowConstructorOptions = {
    height: 600,
    width: 800,
    frame: false,
    icon: iconPath,
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

        if (isDev) {
            this._window.webContents.openDevTools()
        }

        this._window.loadFile(filePath)
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

export class MainWindow extends BaseWindow {
    constructor() {
        super(indexHtmlPath, {
            webPreferences: {
                preload: preloadJsPath
            }
        })

        this._window.on('unmaximize', () => this.onUnmaximize)
    }

    private onUnmaximize() {
        this._window.webContents.send('unmaximized')
    }
}