import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { picturesRepo } from '@dataAccess/repositories/picturesStoreRepo'
import PictureI from '@shared/interfaces/pictureI'
import PictureImageFilesHelper from '@mainUtils/helpers/pictureImageFilesHelper'
import Chanels from '@shared/interfaces/ipc/chanels'
import IdHelper from '@shared/helpers/idHelper'


export default class PicturesChannelGroup {
    public static registry() {
        ipcMain.handle(Chanels.pictures_getAll, () => PicturesChannelGroup.getAll())
        ipcMain.handle(Chanels.pictures_create, (event: IpcMainInvokeEvent, model: PictureI) => PicturesChannelGroup.createOrUpdate(event, model))
        ipcMain.handle(Chanels.pictures_update, (event: IpcMainInvokeEvent, model: PictureI) => PicturesChannelGroup.createOrUpdate(event, model))
        ipcMain.handle(Chanels.pictures_delete, (event: IpcMainInvokeEvent, id: string) => PicturesChannelGroup.delete(event, id))
    }

    private static getAll(): PictureI[] {
        console.info(Chanels.pictures_getAll)
        const arr = picturesRepo.getAll()

        return arr
    }

    private static createOrUpdate(event: IpcMainInvokeEvent, model: PictureI): PictureI {
        console.info(Chanels.pictures_create)

        const forCreate = !model.id 
        const now = new Date().toLocaleString()
        const [images, result] = PictureImageFilesHelper.save(model.images)

        model = {
            ...model,
            id: forCreate ? IdHelper.genId() : model.id,
            created: forCreate ? now : model.created,
            updated: !forCreate ? now : model.updated,
            images: images
        }
       
        //send to render
        if (result.sended > 0) {
            event.sender.send(Chanels.pictureFilesLoaded, result)
        }

        picturesRepo.createOrUpdate(model)

        const newModel = picturesRepo.getOne(model.id)
        return newModel
    }

    private static delete(event: IpcMainInvokeEvent, id: string) {
        console.info(Chanels.pictures_delete)

        const model = picturesRepo.getOne(id)
        const result = PictureImageFilesHelper.remove(model.images)

        //send to render
        if (result.sended > 0) {
            event.sender.send(Chanels.pictureFilesRemoved, result)
        }

        picturesRepo.delete(id)
        return !picturesRepo.has(id)
    }
}