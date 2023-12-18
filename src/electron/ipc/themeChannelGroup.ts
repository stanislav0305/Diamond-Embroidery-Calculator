import { IpcMainInvokeEvent } from 'electron';
import { IpcChannelGroupI, IpcRequestBase } from '@ipc/ipcChannelGroupI'
import { NativeTheme } from '@general/nativeTheme'
import { themeRepo } from '@dataAccess/repositories/themeStoreRepo'//'../dataAccess/repositories/themeStoreRepo'
import ThemeI from '@shared/interfaces/themeI';
import { ThemeEntityI } from '@dataAccess/entities/themeEntityI';


interface IpcRequestTheme extends IpcRequestBase, ThemeI {
}

export class ThemeChannelGroup extends IpcChannelGroupI<ThemeChannelGroup, IpcRequestTheme> {
    public nativeTheme: NativeTheme
    public handles: Map<string, (event: IpcMainInvokeEvent, owner: ThemeChannelGroup, request: IpcRequestTheme) => {}>
    
    constructor(nativeTheme: NativeTheme) {
        super()
        this.baseName = 'theme'
        this.nativeTheme = nativeTheme
        this.handles = new Map ([
            [`${this.baseName}:getCurrent`, ThemeChannelGroup.getCurrent],
            [`${this.baseName}:set`, ThemeChannelGroup.set]
        ])
    }

    public static getCurrent(event: IpcMainInvokeEvent, owner: ThemeChannelGroup) {
        console.info(`${owner.baseName}:getSettings`)
        const theme = themeRepo.get() as ThemeI
        console.log('settings', theme)

        return theme
    }

    public static set(event: IpcMainInvokeEvent, owner: ThemeChannelGroup, request: ThemeI) {
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

        return request
    }
}
