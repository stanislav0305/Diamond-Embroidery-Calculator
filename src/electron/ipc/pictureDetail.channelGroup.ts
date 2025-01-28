import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Channels from '@shared/interfaces/ipc/channels'
import { tablesOptionsRepo } from '@electron/dataAccess/repositories/tablesOptionsStoreRepo'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { ColumnSortI } from '@shared/interfaces/columnSortI'


export default class PictureDetailChannelGroup {
    public static registry() {
        ipcMain.handle(Channels.pictureDetail_tableOptions_get, () => PictureDetailChannelGroup.getTableOptions())
        ipcMain.handle(Channels.pictureDetail_tableOptions_setColumnVisibility, (event: IpcMainInvokeEvent, model: object) => PictureDetailChannelGroup.setColumnVisibility(event, model))
        ipcMain.handle(Channels.pictureDetail_tableOptions_setColumnOrder, (event: IpcMainInvokeEvent, model: string[]) => PictureDetailChannelGroup.setColumnOrder(event, model))
        ipcMain.handle(Channels.pictureDetail_tableOptions_setColumnSort, (event: IpcMainInvokeEvent, model: ColumnSortI[]) => PictureDetailChannelGroup.setColumnSort(event, model))
    }

    //-----------------------------------------------------------------------------------------------------------------------

    private static getTableOptions(): TableOptionsI {
        console.info(Channels.pictureDetail_tableOptions_get)
        const opts = tablesOptionsRepo.getTableOptions('pictureDetailTable')

        return opts
    }

    private static setColumnVisibility(event: IpcMainInvokeEvent, model: object): object {
        console.info(Channels.pictureDetail_tableOptions_setColumnVisibility)
        tablesOptionsRepo.setColumnVisibility('pictureDetailTable', model)

        const result = tablesOptionsRepo.getColumnVisibility('pictureDetailTable')
        return result
    }

    private static setColumnOrder(event: IpcMainInvokeEvent, model: string[]): string[] {
        console.info(Channels.pictureDetail_tableOptions_setColumnOrder)
        tablesOptionsRepo.setColumnOrder('pictureDetailTable', model)

        const result = tablesOptionsRepo.getColumnOrder('pictureDetailTable')
        return result
    }

    private static setColumnSort(event: IpcMainInvokeEvent, model: ColumnSortI[]): ColumnSortI[] {
        console.info(Channels.pictureDetail_tableOptions_setColumnSort)
        tablesOptionsRepo.setColumnSort('pictureDetailTable', model)

        const result = tablesOptionsRepo.getColumnSort('pictureDetailTable')
        return result
    }

    //-----------------------------------------------------------------------------------------------------------------------
}