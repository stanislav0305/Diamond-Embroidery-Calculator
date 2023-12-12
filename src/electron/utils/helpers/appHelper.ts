import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent, nativeTheme } from 'electron'
import mainWindowBuilder from './mainWindowBuilder'
import LogMainHelper from './logMainHelper'
import ThemeSettingsI from '@shared/interfaces/themeSettingsI'
import AppSettingsI from '@shared/interfaces/appSettingsI'
import NativeThemeNameType from 'electron/types/nativeThemeNameType'
import ThemeModeType from '@shared/types/themeModeType'
import ThemeConverter from '../converters/themeConverter'


export default class AppHelper {
    public static mainWindow: BrowserWindow | null = null
    public static isDev: boolean

    private constructor() { }

    public static init() {
        AppHelper.initIsDev()

        app.on('ready', AppHelper.onReady)
        app.on('window-all-closed', AppHelper.onWindowAllClosed)
        app.on('activate', AppHelper.onActivate)
    }

    private static initIsDev() {
        AppHelper.isDev = process.env.NODE_ENV === 'development'
        console.log(`this.isDev=${AppHelper.isDev}`)
    }

    private static onReady() {
        console.log('onReady...')
        AppHelper.mainWindow = mainWindowBuilder.build(AppHelper.isDev)


        AppHelper.mainWindow.on('unmaximize', () => {
            AppHelper.onUnmaximize()
        })
    }

    /*
       Возвращаем приложение в фокус, если пользователь его открыл через иконку в Dock.
       В OS X обычно заново создают окно приложения, когда значок закрепления нажат, 
       и другие окна приложения не открыты - когда окно приложения сново активно.
    */
    private static onActivate() {
        console.log('onActivate...')

        if (!AppHelper.mainWindow) {
            AppHelper.onReady();
        }
    }


    /*
      Закрываем приложение, когда все окна закрыты.
      В OS X это обычное дело для приложений оставаться активным до тех пор, 
      пока пользователь не выйдет явно с помощью Cmd + Q
      Потому если это не виндовс и все окна закрыты, то закрываем приложение
    */
    private static onWindowAllClosed() {
        console.log('onWindowAllClosed...')

        if (process.platform !== 'darwin') {
            app.quit()
        }
    }

    public static getSettings(): AppSettingsI {
        return {
            versions: {
                node: process.versions.node,
                chrome: process.versions.chrome,
                electron: process.versions.electron
            },
            paths: {
                logPath: LogMainHelper.path
            }
        }
    }

    public static exit() {
        app.exit(0)
    }

    public static onUnmaximize() {
        AppHelper.mainWindow!.webContents.send('unmaximized')
    }

    public static maximize() {
        AppHelper.mainWindow?.maximize()
    }

    public static unmaximize() {
        AppHelper.mainWindow?.unmaximize()
    }

    public static minimize() {
        AppHelper.mainWindow?.minimize()
    }

    public static themeSettings: ThemeSettingsI = {
        themeMode: ThemeConverter.toThemeMode(nativeTheme.themeSource),
        themeName: 'cerulean'
    }
}

ipcMain.handle('theme:getCurrent', (): ThemeSettingsI => {
    console.info('theme:getCurrent', AppHelper.themeSettings)
    return AppHelper.themeSettings
})

ipcMain.handle('theme:set', (event : IpcMainInvokeEvent, settings: ThemeSettingsI) => {
    console.info('theme:set')
    console.log('settings', settings)
    AppHelper.themeSettings = settings
    nativeTheme.themeSource = ThemeConverter.toNativeThemeName(settings.themeMode)

    return settings
})

ipcMain.handle('app:getSettings', () => {
    console.info('app:getSettings')
    return AppHelper.getSettings()
})


ipcMain.handle('app:close', () => {
    console.info('app:close')
    AppHelper.exit()
})


ipcMain.handle('window:minimize', () => {
    console.info('window:minimize')
    AppHelper.minimize()
})

ipcMain.handle('window:maximize', () => {
    console.info('window:maximize')
    AppHelper.maximize()
})

ipcMain.handle('window:unmaximize', () => {
    console.info('window:unmaximize')
    AppHelper.unmaximize()
})