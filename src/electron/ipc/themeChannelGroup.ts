import { IpcMainInvokeEvent, ipcMain } from 'electron'
import NativeTheme from '@general/nativeTheme'
import { themeRepo } from '@dataAccess/repositories/themeStoreRepo'
import ThemeI from '@shared/interfaces/themeI'
import Chanels from '@shared/interfaces/ipc/chanels'


export default class ThemeChannelGroup {
    private static nativeTheme: NativeTheme

    public static registry(nativeTheme: NativeTheme) {
        ThemeChannelGroup.nativeTheme = nativeTheme

        ipcMain.handle(Chanels.theme_set, (event: IpcMainInvokeEvent, model: ThemeI) => ThemeChannelGroup.set(event, model))
        ipcMain.handle(Chanels.theme_getCurrent, () => ThemeChannelGroup.getCurrent())
    }

    private static set(event: IpcMainInvokeEvent, model: ThemeI): ThemeI {
        console.info(Chanels.theme_set)
        themeRepo.set(model)
        ThemeChannelGroup.nativeTheme.set(model.mode)

        const saved = themeRepo.get()
        return saved
    }

    private static getCurrent(): ThemeI {
        console.info(Chanels.theme_getCurrent)
        const theme = themeRepo.get()

        return theme
    }
}
