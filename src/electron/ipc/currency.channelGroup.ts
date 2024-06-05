import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Chanels from '@shared/interfaces/ipc/chanels'
import { CurrencyI } from '@shared/interfaces/currencyI'
import { currencyRepo } from '@electron/dataAccess/repositories/currencyStoreRepo'


export default class CurrencyChannelGroup {
    public static registry() {
        ipcMain.handle(Chanels.currency_set, (event: IpcMainInvokeEvent, model: CurrencyI) => CurrencyChannelGroup.set(event, model))
        ipcMain.handle(Chanels.currency_getCurrent, () => CurrencyChannelGroup.getCurrent())
    }

    private static set(event: IpcMainInvokeEvent, model: CurrencyI): CurrencyI {
        console.info(Chanels.currency_set)
        currencyRepo.set(model)

        const saved = currencyRepo.get()
        event.sender.send(Chanels.currency_currencyChenged, saved)

        return saved
    }

    private static getCurrent(): CurrencyI {
        console.info(Chanels.currency_getCurrent)
        const theme = currencyRepo.get()

        return theme
    }
}
