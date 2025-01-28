import { IpcMainInvokeEvent, ipcMain } from 'electron'
import PictureI from '@shared/interfaces/pictureI'
import Channels from '@shared/interfaces/ipc/channels'
import PicturesDefaultSetI from '@shared/interfaces/picturesDefaultSetI'
import { picturesDefaultSetStoreRepo } from '@electron/dataAccess/repositories/picturesDefaultSetStoreRepo'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { tablesOptionsRepo } from '@electron/dataAccess/repositories/tablesOptionsStoreRepo'
import { ColumnSortI } from '@shared/interfaces/columnSortI'


export default class PicturesDefaultSetChannelGroup {
    public static registry() {
        ipcMain.handle(Channels.picturesDefaultSet_tableOptions_get, () => PicturesDefaultSetChannelGroup.getTableOptions())
        ipcMain.handle(Channels.picturesDefaultSet_tableOptions_setColumnVisibility, (event: IpcMainInvokeEvent, model: object) => PicturesDefaultSetChannelGroup.setColumnVisibility(event, model))
        ipcMain.handle(Channels.picturesDefaultSet_tableOptions_setColumnOrder, (event: IpcMainInvokeEvent, model: string[]) => PicturesDefaultSetChannelGroup.setColumnOrder(event, model))
        ipcMain.handle(Channels.picturesDefaultSet_tableOptions_setColumnSort, (event: IpcMainInvokeEvent, model: ColumnSortI[]) => PicturesDefaultSetChannelGroup.setColumnSort(event, model))
        ipcMain.handle(Channels.picturesDefaultSet_get, () => PicturesDefaultSetChannelGroup.get())
        ipcMain.handle(Channels.picturesDefaultSet_set, (event: IpcMainInvokeEvent, model: PicturesDefaultSetI) => PicturesDefaultSetChannelGroup.set(event, model))
    }

    //-----------------------------------------------------------------------------------------------------------------------

    private static getTableOptions(): TableOptionsI {
        console.info(Channels.picturesDefaultSet_tableOptions_get)
        const opts = tablesOptionsRepo.getTableOptions('pictureDefaultSetTable')

        return opts
    }

    private static setColumnVisibility(event: IpcMainInvokeEvent, model: object): object {
        console.info(Channels.picturesDefaultSet_tableOptions_setColumnVisibility)
        tablesOptionsRepo.setColumnVisibility('pictureDefaultSetTable', model)

        const result = tablesOptionsRepo.getColumnVisibility('pictureDefaultSetTable')
        return result
    }

    private static setColumnOrder(event: IpcMainInvokeEvent, model: string[]): string[] {
        console.info(Channels.picturesDefaultSet_tableOptions_setColumnOrder)
        tablesOptionsRepo.setColumnOrder('pictureDefaultSetTable', model)

        const result = tablesOptionsRepo.getColumnOrder('pictureDefaultSetTable')
        return result
    }

    private static setColumnSort(event: IpcMainInvokeEvent, model: ColumnSortI[]): ColumnSortI[] {
        console.info(Channels.picturesDefaultSet_tableOptions_setColumnSort)
        tablesOptionsRepo.setColumnSort('pictureDefaultSetTable', model)

        const result = tablesOptionsRepo.getColumnSort('pictureDefaultSetTable')
        return result
    }
    
    //-----------------------------------------------------------------------------------------------------------------------

    private static get(): PicturesDefaultSetI {
        console.info(Channels.picturesDefaultSet_get)
        const model =  picturesDefaultSetStoreRepo.get()

        return model
    }

    private static set(event: IpcMainInvokeEvent, model: PicturesDefaultSetI): PicturesDefaultSetI {
        console.info(Channels.picturesDefaultSet_set)
        picturesDefaultSetStoreRepo.set(model)

        const newModel = picturesDefaultSetStoreRepo.get()
        event.sender.send(Channels.picturesDefaultSet_defaultSetChanged, newModel)

        return newModel
    }
}