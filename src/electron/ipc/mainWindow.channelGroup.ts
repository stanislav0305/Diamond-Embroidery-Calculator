import { ipcMain } from 'electron'
import MainWindow from '@general/window'
import Channels from '@shared/interfaces/ipc/channels'


export default class MainWindowChannelGroup {
    private static mainWindow: MainWindow

    public static registry(mainWindow: MainWindow) {
        MainWindowChannelGroup.mainWindow = mainWindow

        ipcMain.handle(Channels.window_minimize, () => MainWindowChannelGroup.minimize())
        ipcMain.handle(Channels.window_maximize, () => MainWindowChannelGroup.maximize())
        ipcMain.handle(Channels.window_unmaximize, () => MainWindowChannelGroup.unmaximize())
    }

    private static minimize() {
        console.info(Channels.window_minimize)
        MainWindowChannelGroup.mainWindow.minimize()
    }

    private static maximize() {
        console.info(Channels.window_maximize)
        MainWindowChannelGroup.mainWindow.maximize()
    }

    private static unmaximize() {
        console.info(Channels.window_unmaximize)
        MainWindowChannelGroup.mainWindow.unmaximize()
    }
}