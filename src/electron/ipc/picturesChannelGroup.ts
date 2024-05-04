import { IpcMainInvokeEvent } from 'electron';
import { IpcChannelGroupI, IpcRequestBase, IpcResponseBase } from '@ipc/ipcChannelGroupI'
import { picturesRepo } from '@dataAccess/repositories/picturesStoreRepo'
import PictureI from '@shared/interfaces/pictureI';
import { PictureEntityI } from '@dataAccess/entities/pictureEntityI';


interface IpcRequestPicture extends IpcRequestBase, PictureI {
}

interface IpcResponsePicture extends IpcResponseBase, PictureI {

}

type IpcRequestPictureT = string | IpcRequestPicture
type IpcResponsePictureT = boolean | IpcResponsePicture | IpcResponsePicture[]



export class PicturesChannelGroup extends IpcChannelGroupI<PicturesChannelGroup, IpcRequestPictureT, IpcResponsePictureT> {
    public handles: Map<string, (event: IpcMainInvokeEvent, owner: PicturesChannelGroup, request: IpcRequestPictureT)
        => IpcResponsePictureT>

    constructor() {
        super()
        this.baseName = 'pictures'
        this.handles = new Map([
            [`${this.baseName}:getAll`, PicturesChannelGroup.getAll],
            [`${this.baseName}:create`, PicturesChannelGroup.create],
            [`${this.baseName}:read`, PicturesChannelGroup.read],
            [`${this.baseName}:update`, PicturesChannelGroup.update],
            [`${this.baseName}:delete`, PicturesChannelGroup.delete]
        ]) 
    }

    public static getAll(event: IpcMainInvokeEvent, owner: PicturesChannelGroup): PictureI[] {
        console.info(`${owner.baseName}:getAll`)
        const arr = picturesRepo.get() as PictureI[]
        console.log('pictures:', arr)

        return arr
    }

    public static create(event: IpcMainInvokeEvent, owner: PicturesChannelGroup, request: IpcRequestPictureT): IpcResponsePictureT {
        console.info(`${owner.baseName}:create`)
         const model = request as PictureI
         const entity = model as PictureEntityI

        picturesRepo.setArrayRow(entity)

        return entity as IpcResponsePicture
    }

    public static read(event: IpcMainInvokeEvent, owner: PicturesChannelGroup, request: IpcRequestPictureT): IpcResponsePictureT {
        const id = request as string
        return {} as IpcResponsePicture
    }

    public static update(event: IpcMainInvokeEvent, owner: PicturesChannelGroup, request: IpcRequestPictureT): IpcResponsePictureT {
        return {} as IpcResponsePicture
    }

    public static delete(event: IpcMainInvokeEvent, owner: PicturesChannelGroup, request: IpcRequestPictureT): IpcResponsePictureT {
        const id = request as string

        return false
    }

}