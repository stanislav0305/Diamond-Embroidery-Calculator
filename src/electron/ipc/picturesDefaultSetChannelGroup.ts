import { IpcMainInvokeEvent, ipcMain } from 'electron'
import PictureI from '@shared/interfaces/pictureI'
import Chanels from '@shared/interfaces/ipc/chanels'
import PicturesDefaultSetI from '@shared/interfaces/picturesDefaultSetI'
import { picturesDefaultSetStoreRepo } from '@electron/dataAccess/repositories/picturesDefaultSetStoreRepo'


export default class PicturesDefaultSetChannelGroup {
    public static registry() {
        ipcMain.handle(Chanels.picturesDefaultSet_get, () => PicturesDefaultSetChannelGroup.get())
        ipcMain.handle(Chanels.picturesDefaultSet_set, (event: IpcMainInvokeEvent, model: PictureI) => PicturesDefaultSetChannelGroup.set(event, model))
    }

    private static get(): PicturesDefaultSetI {
        console.info(Chanels.picturesDefaultSet_get)
        const model =  picturesDefaultSetStoreRepo.get()

        return model
    }

    private static set(event: IpcMainInvokeEvent, model: PicturesDefaultSetI): PicturesDefaultSetI {
        console.info(Chanels.picturesDefaultSet_set)
        picturesDefaultSetStoreRepo.set(model)

        const newModel = picturesDefaultSetStoreRepo.get()
        return newModel
    }
}