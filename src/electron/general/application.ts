import { app } from 'electron'
import MainWindow from '@general/window'
import NativeTheme from '@general/nativeTheme'
import ThemeChannelGroup from '@ipc/theme.channelGroup'
import AppChannelGroup from '@ipc/app.channelGroup'
import MainWindowChannelGroup from '@ipc/mainWindow.channelGroup'
import PicturesChannelGroup from '@ipc/pictures.channelGroup'
import PicturesDefaultSetChannelGroup from '@ipc/picturesDefaultSet.channelGroup'
import PicturesImagesChannelGroup from '@ipc/picturesImages.channelGroup'
import PictureDetailChannelGroup from '@electron/ipc/pictureDetail.channelGroup'
import SimilarPicturesChannelGroup from '@electron/ipc/similarPictures.channelGroup'
import CurrencyChannelGroup from '@electron/ipc/currency.channelGroup'


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
        CurrencyChannelGroup.registry()
        MainWindowChannelGroup.registry(this.mainWindow)
        PicturesChannelGroup.registry()
        PictureDetailChannelGroup.registry()
        PicturesDefaultSetChannelGroup.registry()
        SimilarPicturesChannelGroup.registry()
        PicturesImagesChannelGroup.registry(this.mainWindow)
    }

    /*
        We return the application to focus if the user opened it through the Dock icon.
        In OS X, it is common to re-create the application window when the dock icon is clicked,
        and other application windows are not open - when the application window is active again.
    */
    private onActivate() {
        console.log('onActivate...')
        !this.mainWindow && this.onReady()
    }


    /*
        Close the application when all windows are closed.
        In OS X it is common for applications to remain active until
        until the user exits explicitly with Cmd + Q
        Therefore, if this is not Windows and all windows are closed, then close the application
    */
    private onWindowAllClosed() {
        console.log('onWindowAllClosed...')
        process.platform !== 'darwin' && app.quit()
    }
}