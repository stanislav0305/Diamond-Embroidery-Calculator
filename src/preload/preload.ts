import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import ThemeI from '@shared/interfaces/themeI'
import PictureI from '@shared/interfaces/pictureI'
import ContextBridgeApiI from '@shared/interfaces/contextBridgeApiI'


const API: ContextBridgeApiI = {
  theme: {
    getCurrent: () => ipcRenderer.invoke('theme:getCurrent').catch((e: Error) => console.error(e)),
    set: (settings: ThemeI) => ipcRenderer.invoke('theme:set', settings).catch((e: Error) => console.error(e))
  },
  app: {
    getSettings: () => ipcRenderer.invoke('app:getSettings').catch((e: Error) => console.error(e)),
    close: () => ipcRenderer.invoke('app:close').catch((e: Error) => console.error(e))
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize').catch((e: Error) => console.error(e)),
    maximize: () => ipcRenderer.invoke('window:maximize').catch((e: Error) => console.error(e)),
    unmaximize: () => ipcRenderer.invoke('window:unmaximize').catch((e: Error) => console.error(e)),
    on: {
      unmaximized: (listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('unmaximized', listener)
      }
    },
    off: {
      unmaximized: () => {
        ipcRenderer.removeAllListeners('unmaximized')
      }
    }
  },
  pictures: {
    getAll: () => ipcRenderer.invoke('pictures:getAll').catch((e: Error) => console.error(e)),
    create: (picture: PictureI) => ipcRenderer.invoke('pictures:create', picture).catch((e: Error) => console.error(e)),
    read: (id: string) => ipcRenderer.invoke('pictures:read', id).catch((e: Error) => console.error(e)),
    update: (picture: PictureI) => ipcRenderer.invoke('pictures:update', picture).catch((e: Error) => console.error(e)),
    delete: (id: string) => ipcRenderer.invoke('pictures:delete', id).catch((e: Error) => console.error(e)),
  }
}


contextBridge.exposeInMainWorld('api', API)