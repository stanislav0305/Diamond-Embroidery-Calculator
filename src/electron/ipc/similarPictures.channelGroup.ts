import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Channels from '@shared/interfaces/ipc/channels'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { tablesOptionsRepo } from '@electron/dataAccess/repositories/tablesOptionsStoreRepo'
import { ColumnSortI } from '@shared/interfaces/columnSortI'


export default class SimilarPicturesChannelGroup {
    public static registry() {
        ipcMain.handle(Channels.similarPictures_tableOptions_get, () => SimilarPicturesChannelGroup.getTableOptions())
        ipcMain.handle(Channels.similarPictures_tableOptions_setColumnVisibility, (event: IpcMainInvokeEvent, model: object) => SimilarPicturesChannelGroup.setColumnVisibility(event, model))
        ipcMain.handle(Channels.similarPictures_tableOptions_setColumnOrder, (event: IpcMainInvokeEvent, model: string[]) => SimilarPicturesChannelGroup.setColumnOrder(event, model))
        ipcMain.handle(Channels.similarPictures_tableOptions_setColumnSort, (event: IpcMainInvokeEvent, model: ColumnSortI[]) => SimilarPicturesChannelGroup.setColumnSort(event, model))
    }

    //-----------------------------------------------------------------------------------------------------------------------

    private static getTableOptions(): TableOptionsI {
        console.info(Channels.picturesDefaultSet_tableOptions_get)
        const opts = tablesOptionsRepo.getTableOptions('similarPictureTable')

        return opts
    }

    private static setColumnVisibility(event: IpcMainInvokeEvent, model: object): object {
        console.info(Channels.picturesDefaultSet_tableOptions_setColumnVisibility)
        tablesOptionsRepo.setColumnVisibility('similarPictureTable', model)

        const result = tablesOptionsRepo.getColumnVisibility('similarPictureTable')
        return result
    }

    private static setColumnOrder(event: IpcMainInvokeEvent, model: string[]): string[] {
        console.info(Channels.picturesDefaultSet_tableOptions_setColumnOrder)
        tablesOptionsRepo.setColumnOrder('similarPictureTable', model)

        const result = tablesOptionsRepo.getColumnOrder('similarPictureTable')
        return result
    }

    private static setColumnSort(event: IpcMainInvokeEvent, model: ColumnSortI[]): ColumnSortI[] {
        console.info(Channels.picturesDefaultSet_tableOptions_setColumnSort)
        tablesOptionsRepo.setColumnSort('similarPictureTable', model)

        const result = tablesOptionsRepo.getColumnSort('similarPictureTable')
        return result
    }
    
    //-----------------------------------------------------------------------------------------------------------------------
}