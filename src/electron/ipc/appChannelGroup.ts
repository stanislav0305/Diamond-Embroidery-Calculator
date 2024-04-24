import { IpcMainInvokeEvent } from 'electron';
import { IpcChannelGroupI, IpcRequestBase, IpcResponseBase } from '@ipc/ipcChannelGroupI'
import { appSettingsRepo } from  '@dataAccess/repositories/appSettingsRepo'
import AppSettingsI from '@shared/interfaces/appSettingsI';
import { app } from '../main'

interface IpcRequestApp extends IpcRequestBase, AppSettingsI {
}

interface IpcResponseAppSettings extends IpcResponseBase, AppSettingsI {
}

export class AppChannelGroup extends IpcChannelGroupI<AppChannelGroup, IpcRequestApp, IpcResponseAppSettings> {
    public handles: Map<string, (event: IpcMainInvokeEvent, owner: AppChannelGroup) => IpcResponseAppSettings | void>

    constructor() {
        super()
        this.baseName = 'app'
        this.handles = new Map([
            [`${this.baseName}:getSettings`, AppChannelGroup.getSettings],
            [`${this.baseName}:close`, AppChannelGroup.close]
        ])
    }

    public static getSettings(event: IpcMainInvokeEvent, owner: AppChannelGroup) : IpcResponseAppSettings {
        console.info(`${owner.baseName}:getSettings`)
        const settings = appSettingsRepo.get() as AppSettingsI
        console.log('settings', settings)
        return settings
    }

    public static close(event: IpcMainInvokeEvent, owner: AppChannelGroup) {
        console.info(`${owner.baseName}:close`)
        app.exit()
    }
}