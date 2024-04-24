import { IpcMainInvokeEvent } from 'electron';
import { IpcChannelGroupI, IpcRequestBase, IpcResponseBase } from '@ipc/ipcChannelGroupI'
import { NativeTheme } from '@general/nativeTheme'
import { themeRepo } from '@dataAccess/repositories/themeStoreRepo'
import ThemeI from '@shared/interfaces/themeI';
import { ThemeEntityI } from '@dataAccess/entities/themeEntityI';


interface IpcRequestTheme extends IpcRequestBase, ThemeI {
}

interface IpcResponseTheme extends IpcResponseBase, ThemeI {
}

export class ThemeChannelGroup extends IpcChannelGroupI<ThemeChannelGroup, IpcRequestTheme, IpcResponseTheme> {
    public nativeTheme: NativeTheme
    public handles: Map<string, (event: IpcMainInvokeEvent, owner: ThemeChannelGroup, request: IpcRequestTheme)
        => IpcResponseTheme | void>

    constructor(nativeTheme: NativeTheme) {
        super()
        this.baseName = 'theme'
        this.nativeTheme = nativeTheme

        this.handles = new Map ([
            [`${this.baseName}:getCurrent`, ThemeChannelGroup.getCurrent],
            [`${this.baseName}:set`, ThemeChannelGroup.set]
        ])
        
    }

    public static set(event: IpcMainInvokeEvent, owner: ThemeChannelGroup, request: ThemeI): IpcResponseTheme {
        console.info(`${owner.baseName}:set`)
        console.log('theme', request)

        try {
            console.log('themeRepo=', themeRepo)
            themeRepo.set(request as ThemeEntityI)
        } catch (err) {
            console.error(err);
            throw err
        }

        owner.nativeTheme.set(request.mode)

        return request as IpcResponseTheme
    }

    public static getCurrent(event: IpcMainInvokeEvent, owner: ThemeChannelGroup): IpcResponseTheme {
        console.info(`${owner.baseName}:getSettings`)
        const theme = themeRepo.get() as ThemeI
        console.log('settings', theme)

        return theme as IpcResponseTheme
    }
}
