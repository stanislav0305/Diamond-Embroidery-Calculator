import { BrowserWindow } from 'electron'
import path from 'path'


export default class mainWindowBuilder {
    private constructor() { }

    public static build(isDev: boolean) {
        console.log('createWindow...')

        const mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
            frame: false,
            //title: `Yet another Electron Application`,
            icon: path.resolve(__dirname, 'assets', 'diamond.ico'),
            //autoHideMenuBar: true //скрыть меню окна
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            }
        })

        if (isDev) {
            mainWindow.webContents.openDevTools()
        }

        mainWindow.loadFile(path.resolve(__dirname, 'index.html'))

        return mainWindow
    }
}
