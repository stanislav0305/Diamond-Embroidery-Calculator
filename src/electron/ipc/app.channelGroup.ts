import { ipcMain } from 'electron'
import { appSettingsRepo } from '@dataAccess/repositories/appSettingsRepo'
import AppSettingsI from '@shared/interfaces/appSettingsI'
import Channels from '@shared/interfaces/ipc/channels'
import { app } from '@electron/main'


export default class AppChannelGroup {
    public static registry() {
        ipcMain.handle(Channels.app_getSettings, () => AppChannelGroup.getSettings())
        ipcMain.handle(Channels.app_close, () => AppChannelGroup.close())
    }

    private static getSettings(): AppSettingsI {
        console.info(Channels.app_getSettings)
        const settings = appSettingsRepo.get()
        return settings
    }

    private static close() {
        console.info(Channels.app_close)
        app.exit()
    }
}