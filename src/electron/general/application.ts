import { app } from 'electron'
import { MainWindow } from '@general/window'
import { NativeTheme } from '@general/nativeTheme'
import { themeRepo } from '@dataAccess/repositories/themeStoreRepo'
import ThemeI from '@shared/interfaces/themeI'
import { ThemeChannelGroup } from '@ipc/themeChannelGroup'
import { AppChannelGroup } from '@ipc/appChannelGroup'
import { MainWindowChannelGroup } from '@ipc/mainWindowChannelGroup'
import { IpcChannelsRegister } from '@ipc/ipcChannelsRegister'


export class Application {
    private mainWindow: MainWindow | null = null
    private nativeTheme: NativeTheme | null = null

    constructor() {
        app.on('ready', this.onReady)
        app.on('window-all-closed', this.onWindowAllClosed)
        app.on('activate', this.onActivate)
    }

    public exit() {
        console.log('exit...')
        app.exit(0)
    }

    private onReady() {
        console.log('onReady...')
        this.mainWindow = new MainWindow()

        const theme = themeRepo.get() as ThemeI
        this.nativeTheme = new NativeTheme(theme.mode)

        IpcChannelsRegister.add([
            new AppChannelGroup(),
            new MainWindowChannelGroup(this.mainWindow),
            new ThemeChannelGroup(this.nativeTheme)
        ])
    }

    /*
       Возвращаем приложение в фокус, если пользователь его открыл через иконку в Dock.
       В OS X обычно заново создают окно приложения, когда значок закрепления нажат, 
       и другие окна приложения не открыты - когда окно приложения сново активно.
    */
    private onActivate() {
        console.log('onActivate...')
        !this.mainWindow && this.onReady()
    }


    /*
      Закрываем приложение, когда все окна закрыты.
      В OS X это обычное дело для приложений оставаться активным до тех пор, 
      пока пользователь не выйдет явно с помощью Cmd + Q
      Потому если это не виндовс и все окна закрыты, то закрываем приложение
    */
    private onWindowAllClosed() {
        console.log('onWindowAllClosed...')
        process.platform !== 'darwin' && app.quit()
    }
}