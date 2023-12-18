import { IpcMainInvokeEvent } from 'electron'


export interface IpcRequestBase {
}

export class BaseChannelGroup {
    public handles: Map<string, (event: any, owner: any, request: any) => {} | void> = new Map()
}

export abstract class IpcChannelGroupI<T extends BaseChannelGroup, R extends IpcRequestBase> extends BaseChannelGroup {
    public baseName: string = ''
    public abstract override handles: Map<string, (event: IpcMainInvokeEvent, owner: T, request: R) => {} | void>
}