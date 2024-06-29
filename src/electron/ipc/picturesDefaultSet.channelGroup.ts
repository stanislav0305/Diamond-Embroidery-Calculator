import { IpcMainInvokeEvent, ipcMain } from 'electron'
import PictureI from '@shared/interfaces/pictureI'
import Chanels from '@shared/interfaces/ipc/chanels'
import PicturesDefaultSetI from '@shared/interfaces/picturesDefaultSetI'
import { picturesDefaultSetStoreRepo } from '@electron/dataAccess/repositories/picturesDefaultSetStoreRepo'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { tablesOptionsRepo } from '@electron/dataAccess/repositories/tablesOptionsStoreRepo'
import { ColumnSortI } from '@shared/interfaces/columnSortI'


export default class PicturesDefaultSetChannelGroup {
    public static registry() {
        ipcMain.handle(Chanels.picturesDefaultSet_tableOptions_get, () => PicturesDefaultSetChannelGroup.getTableOptions())
        ipcMain.handle(Chanels.picturesDefaultSet_tableOptions_setColumnVisibility, (event: IpcMainInvokeEvent, model: object) => PicturesDefaultSetChannelGroup.setColumnVisibility(event, model))
        ipcMain.handle(Chanels.picturesDefaultSet_tableOptions_setColumnOrder, (event: IpcMainInvokeEvent, model: string[]) => PicturesDefaultSetChannelGroup.setColumnOrder(event, model))
        ipcMain.handle(Chanels.picturesDefaultSet_tableOptions_setColumnSort, (event: IpcMainInvokeEvent, model: ColumnSortI[]) => PicturesDefaultSetChannelGroup.setColumnSort(event, model))
        ipcMain.handle(Chanels.picturesDefaultSet_get, () => PicturesDefaultSetChannelGroup.get())
        ipcMain.handle(Chanels.picturesDefaultSet_set, (event: IpcMainInvokeEvent, model: PicturesDefaultSetI) => PicturesDefaultSetChannelGroup.set(event, model))
    }

    //-----------------------------------------------------------------------------------------------------------------------

    private static getTableOptions(): TableOptionsI {
        console.info(Chanels.picturesDefaultSet_tableOptions_get)
        const opts = tablesOptionsRepo.getTableOptions('pictureDefaultSetTable')

        return opts
    }

    private static setColumnVisibility(event: IpcMainInvokeEvent, model: object): object {
        console.info(Chanels.picturesDefaultSet_tableOptions_setColumnVisibility)
        tablesOptionsRepo.setColumnVisibility('pictureDefaultSetTable', model)

        const result = tablesOptionsRepo.getColumnVisibility('pictureDefaultSetTable')
        return result
    }

    private static setColumnOrder(event: IpcMainInvokeEvent, model: string[]): string[] {
        console.info(Chanels.picturesDefaultSet_tableOptions_setColumnOrder)
        tablesOptionsRepo.setColumnOrder('pictureDefaultSetTable', model)

        const result = tablesOptionsRepo.getColumnOrder('pictureDefaultSetTable')
        return result
    }

    private static setColumnSort(event: IpcMainInvokeEvent, model: ColumnSortI[]): ColumnSortI[] {
        console.info(Chanels.picturesDefaultSet_tableOptions_setColumnSort)
        tablesOptionsRepo.setColumnSort('pictureDefaultSetTable', model)

        const result = tablesOptionsRepo.getColumnSort('pictureDefaultSetTable')
        return result
    }
    
    //-----------------------------------------------------------------------------------------------------------------------

    private static get(): PicturesDefaultSetI {
        console.info(Chanels.picturesDefaultSet_get)
        const model =  picturesDefaultSetStoreRepo.get()

        return model
    }

    private static set(event: IpcMainInvokeEvent, model: PicturesDefaultSetI): PicturesDefaultSetI {
        console.info(Chanels.picturesDefaultSet_set)
        picturesDefaultSetStoreRepo.set(model)

        const newModel = picturesDefaultSetStoreRepo.get()
        event.sender.send(Chanels.picturesDefaultSet_defaultSetChenged, newModel)

        return newModel
    }
}