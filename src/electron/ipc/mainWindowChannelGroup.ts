import { ipcMain } from 'electron'
import MainWindow from '@general/window'
import Chanels from '@shared/interfaces/ipc/chanels'


export default class MainWindowChannelGroup {
    private static mainWindow: MainWindow

    public static registry(mainWindow: MainWindow) {
        MainWindowChannelGroup.mainWindow = mainWindow

        ipcMain.handle(Chanels.window_minimize, () => MainWindowChannelGroup.minimize())
        ipcMain.handle(Chanels.window_maximize, () => MainWindowChannelGroup.maximize())
        ipcMain.handle(Chanels.window_unmaximize, () => MainWindowChannelGroup.unmaximize())
    }

    private static minimize() {
        console.info(Chanels.window_minimize)
        MainWindowChannelGroup.mainWindow.minimize()
    }

    private static maximize() {
        console.info(Chanels.window_maximize)
        MainWindowChannelGroup.mainWindow.maximize()
    }

    private static unmaximize() {
        console.info(Chanels.window_unmaximize)
        MainWindowChannelGroup.mainWindow.unmaximize()
    }
}