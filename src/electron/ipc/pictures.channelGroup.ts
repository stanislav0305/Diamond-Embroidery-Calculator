import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { picturesRepo } from '@dataAccess/repositories/picturesStoreRepo'
import PictureI from '@shared/interfaces/pictureI'
import PictureImageFilesHelper from '@mainUtils/helpers/pictureImageFilesHelper'
import Chanels from '@shared/interfaces/ipc/chanels'
import IdHelper from '@shared/helpers/idHelper'
import { tablesOptionsRepo } from '@electron/dataAccess/repositories/tablesOptionsStoreRepo'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { ColumnSortI } from '@shared/interfaces/columnSortI'
import PictureImageI from '@shared/interfaces/pictureImageI'
import ProcessingResultI from '@shared/interfaces/processingResultI'


export default class PicturesChannelGroup {
    public static registry() {
        ipcMain.handle(Chanels.pictures_tableOptions_get, () => PicturesChannelGroup.getTableOptions())
        ipcMain.handle(Chanels.pictures_tableOptions_setColumnVisibility, (event: IpcMainInvokeEvent, model: object) => PicturesChannelGroup.setColumnVisibility(event, model))
        ipcMain.handle(Chanels.pictures_tableOptions_setColumnOrder, (event: IpcMainInvokeEvent, model: string[]) => PicturesChannelGroup.setColumnOrder(event, model))
        ipcMain.handle(Chanels.pictures_tableOptions_setColumnSort, (event: IpcMainInvokeEvent, model: ColumnSortI[]) => PicturesChannelGroup.setColumnSort(event, model))
        ipcMain.handle(Chanels.pictures_getAll, () => PicturesChannelGroup.getAll())
        ipcMain.handle(Chanels.pictures_create, (event: IpcMainInvokeEvent, model: PictureI) => PicturesChannelGroup.createOrUpdate(event, model))
        ipcMain.handle(Chanels.pictures_update, (event: IpcMainInvokeEvent, model: PictureI) => PicturesChannelGroup.createOrUpdate(event, model))
        ipcMain.handle(Chanels.pictures_delete, (event: IpcMainInvokeEvent, id: string) => PicturesChannelGroup.delete(event, id))
    }

    //-----------------------------------------------------------------------------------------------------------------------

    private static getTableOptions(): TableOptionsI {
        console.info(Chanels.pictures_tableOptions_get)
        const opts = tablesOptionsRepo.getTableOptions('pictureTable')

        return opts
    }

    private static setColumnVisibility(event: IpcMainInvokeEvent, model: object): object {
        console.info(Chanels.pictures_tableOptions_setColumnVisibility)
        tablesOptionsRepo.setColumnVisibility('pictureTable', model)

        const result = tablesOptionsRepo.getColumnVisibility('pictureTable')
        return result
    }

    private static setColumnOrder(event: IpcMainInvokeEvent, model: string[]): string[] {
        console.info(Chanels.pictures_tableOptions_setColumnOrder)
        tablesOptionsRepo.setColumnOrder('pictureTable', model)

        const result = tablesOptionsRepo.getColumnOrder('pictureTable')
        return result
    }

    private static setColumnSort(event: IpcMainInvokeEvent, model: ColumnSortI[]): ColumnSortI[] {
        console.info(Chanels.pictures_tableOptions_setColumnSort)
        tablesOptionsRepo.setColumnSort('pictureTable', model)

        const result = tablesOptionsRepo.getColumnSort('pictureTable')
        return result
    }

    //-----------------------------------------------------------------------------------------------------------------------

    private static getAll(): PictureI[] {
        console.info(Chanels.pictures_getAll)
        const arr = picturesRepo.getAll()

        return arr
    }

    private static createOrUpdate(event: IpcMainInvokeEvent, model: PictureI): PictureI {
        console.info(Chanels.pictures_create)

        const forCreate = !model.id
        const now = new Date().toLocaleString()
        const [images, result] = PicturesChannelGroup.saveImages(event, model.images)

        model = {
            ...model,
            id: forCreate ? IdHelper.genId() : model.id,
            created: forCreate ? now : model.created,
            updated: !forCreate ? now : model.updated,
            images: images
        }

        if (!forCreate) {
            const oldModel = picturesRepo.getOne(model.id)
            const removedImgs = oldModel.images.filter(oldImg => model.images.findIndex(img => img.id === oldImg.id) < 0)
            PicturesChannelGroup.removeImages(event, removedImgs)
        }

        picturesRepo.createOrUpdate(model)

        const newModel = picturesRepo.getOne(model.id)
        return newModel
    }

    private static delete(event: IpcMainInvokeEvent, id: string): boolean {
        console.info(Chanels.pictures_delete)

        const model = picturesRepo.getOne(id)
        PicturesChannelGroup.removeImages(event, model.images)

        picturesRepo.delete(id)
        return !picturesRepo.has(id)
    }

    //-----------------------------------------------------------------------------------------------------------------------
    
    private static saveImages(event: IpcMainInvokeEvent, images: PictureImageI[]): [images: PictureImageI[], result: ProcessingResultI] {
        const [imagesSaved, result] = PictureImageFilesHelper.save(images)

        //send to render
        if (result.sended > 0) {
            event.sender.send(Chanels.pictures_images_loaded, result)
        }

        return [imagesSaved, result]
    }

    private static removeImages(event: IpcMainInvokeEvent, images: PictureImageI[]): ProcessingResultI {
        const result = PictureImageFilesHelper.remove(images)

        //send to render
        if (result.sended > 0) {
            event.sender.send(Chanels.pictures_images_removed, result)
        }

        return result
    }
}