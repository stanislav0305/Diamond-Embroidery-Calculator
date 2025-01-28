import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Channels from '@shared/interfaces/ipc/channels'
import { CurrencyI } from '@shared/interfaces/currencyI'
import { currencyRepo } from '@electron/dataAccess/repositories/currencyStoreRepo'


export default class CurrencyChannelGroup {
    public static registry() {
        ipcMain.handle(Channels.currency_set, (event: IpcMainInvokeEvent, model: CurrencyI) => CurrencyChannelGroup.set(event, model))
        ipcMain.handle(Channels.currency_getCurrent, () => CurrencyChannelGroup.getCurrent())
    }

    private static set(event: IpcMainInvokeEvent, model: CurrencyI): CurrencyI {
        console.info(Channels.currency_set)
        currencyRepo.set(model)

        const saved = currencyRepo.get()
        event.sender.send(Channels.currency_currencyChanged, saved)

        return saved
    }

    private static getCurrent(): CurrencyI {
        console.info(Channels.currency_getCurrent)
        const theme = currencyRepo.get()

        return theme
    }
}
