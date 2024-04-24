import { IpcMainInvokeEvent } from 'electron';
import { IpcChannelGroupI, IpcRequestBase } from '@ipc/ipcChannelGroupI'
import { MainWindow } from '@general/window'


interface IpcRequestMainWindow extends IpcRequestBase {
}

export class MainWindowChannelGroup extends IpcChannelGroupI<MainWindowChannelGroup, IpcRequestMainWindow, void> {
    public handles: Map<string, (event: IpcMainInvokeEvent, owner: MainWindowChannelGroup) => void>
    public mainWindow: MainWindow

    constructor(mainWindow: MainWindow) {
        super()
        this.baseName = 'window'
        this.mainWindow = mainWindow
        this.handles = new Map([
            [`${this.baseName}:minimize`, MainWindowChannelGroup.minimize],
            [`${this.baseName}:maximize`, MainWindowChannelGroup.maximize],
            [`${this.baseName}:unmaximize`, MainWindowChannelGroup.unmaximize]
        ])
    }

    public static minimize(event: IpcMainInvokeEvent, owner: MainWindowChannelGroup) {
        console.info(`${owner.baseName}:minimize`)
        owner.mainWindow.minimize()
    }

    public static maximize(event: IpcMainInvokeEvent, owner: MainWindowChannelGroup) {
        console.info(`${owner.baseName}:maximize`)
        owner.mainWindow.maximize()
    }

    public static unmaximize(event: IpcMainInvokeEvent, owner: MainWindowChannelGroup) {
        console.info(`${owner.baseName}:unmaximize`)
        owner.mainWindow.unmaximize()
    }
}