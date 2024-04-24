import { ipcMain } from 'electron'
import { BaseChannelGroup } from '@ipc/ipcChannelGroupI'


export class IpcChannelsRegister {
    static add(ipcChannels: BaseChannelGroup[]) {

        ipcChannels.forEach(channelGroup => {
            for (let [channelName, handle] of channelGroup.handles) {
                console.info(`registred chennel handle method:${channelName}`)
                ipcMain.handle(
                    channelName,
                    (event, request) => handle(event, channelGroup, request)
                )
            }
        })
    }
}