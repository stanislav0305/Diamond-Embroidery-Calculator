import { ipcMain } from 'electron'
import { appSettingsRepo } from '@dataAccess/repositories/appSettingsRepo'
import AppSettingsI from '@shared/interfaces/appSettingsI'
import Chanels from '@shared/interfaces/ipc/chanels'
import { app } from '@electron/main'


export default class AppChannelGroup {
    public static registry() {
        ipcMain.handle(Chanels.app_getSettings, () => AppChannelGroup.getSettings())
        ipcMain.handle(Chanels.app_close, () => AppChannelGroup.close())
    }

    private static getSettings(): AppSettingsI {
        console.info(Chanels.app_getSettings)
        const settings = appSettingsRepo.get()
        return settings
    }

    private static close() {
        console.info(Chanels.app_close)
        app.exit()
    }
}