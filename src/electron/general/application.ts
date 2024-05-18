import { app } from 'electron'
import MainWindow from '@general/window'
import NativeTheme from '@general/nativeTheme'
import ThemeChannelGroup from '@ipc/theme.channelGroup'
import AppChannelGroup from '@ipc/app.channelGroup'
import MainWindowChannelGroup from '@ipc/mainWindow.channelGroup'
import PicturesChannelGroup from '@ipc/pictures.channelGroup'
import PicturesDefaultSetChannelGroup from '@ipc/picturesDefaultSet.channelGroup'
import PicturesImagesChannelGroup from '@ipc/picturesImages.channelGroup'


export class Application {
    private nativeTheme: NativeTheme | null = null
    private mainWindow: MainWindow | null = null
    
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
        this.nativeTheme = new NativeTheme()
        this.mainWindow = new MainWindow()

        AppChannelGroup.registry()
        ThemeChannelGroup.registry(this.nativeTheme)
        MainWindowChannelGroup.registry(this.mainWindow)
        PicturesChannelGroup.registry()
        PicturesDefaultSetChannelGroup.registry()
        PicturesImagesChannelGroup.registry(this.mainWindow)
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