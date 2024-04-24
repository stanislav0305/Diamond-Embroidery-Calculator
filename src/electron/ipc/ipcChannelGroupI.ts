import { IpcMainInvokeEvent } from 'electron'


export interface IpcRequestBase {
}

export interface IpcResponseBase {
}

export class BaseChannelGroup {
    public handles: Map<string, (event: any, owner: any, request: any) => any | any[] | void> = new Map()
}

export abstract class IpcChannelGroupI<T extends BaseChannelGroup, R extends IpcRequestBase, Resp extends IpcResponseBase | void> extends BaseChannelGroup {
    public baseName: string = ''
    public abstract override handles:
        Map<string, (event: IpcMainInvokeEvent, owner: T, request: R) => Resp | Resp[] | void>

}