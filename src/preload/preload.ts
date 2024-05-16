import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import ThemeI from '@shared/interfaces/themeI'
import PictureI from '@shared/interfaces/pictureI'
import ContextBridgeApiI from '@shared/interfaces/ipc/contextBridgeApiI'
import Chanels from '@shared/interfaces/ipc/chanels'
import { ProcessingResultI } from '@shared/interfaces/ProcessingResultI'


const fCatch = (e: Error) => {
  console.error(e)
  throw e
}

const API: ContextBridgeApiI = {
  theme: {
    getCurrent: () => ipcRenderer.invoke(Chanels.theme_getCurrent).catch(e => fCatch(e)),
    set: (settings: ThemeI) => ipcRenderer.invoke(Chanels.theme_set, settings).catch(e => fCatch(e)),
  },
  app: {
    getSettings: () => ipcRenderer.invoke(Chanels.app_getSettings).catch(e => fCatch(e)),
    close: () => ipcRenderer.invoke(Chanels.app_close).catch(e => fCatch(e))
  },
  window: {
    minimize: () => ipcRenderer.invoke(Chanels.window_minimize).catch(e => fCatch(e)),
    maximize: () => ipcRenderer.invoke(Chanels.window_maximize).catch(e => fCatch(e)),
    unmaximize: () => ipcRenderer.invoke(Chanels.window_unmaximize).catch(e => fCatch(e)),
    on: {
      unmaximized: (listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on(Chanels.unmaximized, listener)
      }
    },
    off: {
      unmaximized: () => {
        ipcRenderer.removeAllListeners(Chanels.unmaximized)
      }
    }
  },
  pictures: {
    getAll: () => ipcRenderer.invoke(Chanels.pictures_getAll).catch(e => fCatch(e)),
    create: (picture: PictureI) => ipcRenderer.invoke(Chanels.pictures_create, picture).catch(e => fCatch(e)),
    read: (id: string) => ipcRenderer.invoke('pictures:read', id).catch(e => fCatch(e)),
    update: (picture: PictureI) => ipcRenderer.invoke(Chanels.pictures_update, picture).catch(e => fCatch(e)),
    delete: (id: string) => ipcRenderer.invoke(Chanels.pictures_delete, id).catch(e => fCatch(e)),
    on: {
      pictureFilesLoaded: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => {
        ipcRenderer.on(Chanels.pictureFilesLoaded, listener)
      },
      pictureFilesRemoved: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => {
        ipcRenderer.on(Chanels.pictureFilesRemoved, listener)
      }
    },
    off: {
      pictureFilesLoaded: () => {
        ipcRenderer.removeAllListeners(Chanels.pictureFilesLoaded)
      },
      pictureFilesRemoved: () => {
        ipcRenderer.removeAllListeners(Chanels.pictureFilesRemoved)
      }
    }
  }
}

contextBridge.exposeInMainWorld('api', API)