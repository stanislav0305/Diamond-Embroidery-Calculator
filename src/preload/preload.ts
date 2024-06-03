import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import ThemeI from '@shared/interfaces/themeI'
import PictureI from '@shared/interfaces/pictureI'
import ContextBridgeApiI from '@shared/interfaces/ipc/contextBridgeApiI'
import Chanels from '@shared/interfaces/ipc/chanels'
import ProcessingResultI from '@shared/interfaces/processingResultI'
import PicturesDefaultSetI from '@shared/interfaces/picturesDefaultSetI'
import { ColumnSortI } from '@shared/interfaces/columnSortI'


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
  picturesDefaultSet: {
    tableOptions: {
      get: () => ipcRenderer.invoke(Chanels.picturesDefaultSet_tableOptions_get).catch(e => fCatch(e)),
      setColumnVisibility: (model: object) => ipcRenderer.invoke(Chanels.picturesDefaultSet_tableOptions_setColumnVisibility, model).catch(e => fCatch(e)),
      setColumnOrder: (model: string[]) => ipcRenderer.invoke(Chanels.picturesDefaultSet_tableOptions_setColumnOrder, model).catch(e => fCatch(e)),
      setColumnSort:(model: ColumnSortI[]) => ipcRenderer.invoke(Chanels.picturesDefaultSet_tableOptions_setColumnSort, model).catch(e => fCatch(e)),
    },
    get: () => ipcRenderer.invoke(Chanels.picturesDefaultSet_get).catch(e => fCatch(e)),
    set: (model: PicturesDefaultSetI) => ipcRenderer.invoke(Chanels.picturesDefaultSet_set, model).catch(e => fCatch(e)),
  },
  pictureDetail: {
    tableOptions: {
      get: () => ipcRenderer.invoke(Chanels.pictureDetail_tableOptions_get).catch(e => fCatch(e)),
      setColumnVisibility: (model: object) => ipcRenderer.invoke(Chanels.pictureDetail_tableOptions_setColumnVisibility, model).catch(e => fCatch(e)),
      setColumnOrder: (model: string[]) => ipcRenderer.invoke(Chanels.pictureDetail_tableOptions_setColumnOrder, model).catch(e => fCatch(e)),
      setColumnSort:(model: ColumnSortI[]) => ipcRenderer.invoke(Chanels.pictureDetail_tableOptions_setColumnSort, model).catch(e => fCatch(e)),
    }
  },
  pictures: {
    tableOptions: {
      get: () => ipcRenderer.invoke(Chanels.pictures_tableOptions_get).catch(e => fCatch(e)),
      setColumnVisibility: (model: object) => ipcRenderer.invoke(Chanels.pictures_tableOptions_setColumnVisibility, model).catch(e => fCatch(e)),
      setColumnOrder: (model: string[]) => ipcRenderer.invoke(Chanels.pictures_tableOptions_setColumnOrder, model).catch(e => fCatch(e)),
      setColumnSort:(model: ColumnSortI[]) => ipcRenderer.invoke(Chanels.pictures_tableOptions_setColumnSort, model).catch(e => fCatch(e)),
    },
    getAll: () => ipcRenderer.invoke(Chanels.pictures_getAll).catch(e => fCatch(e)),
    create: (model: PictureI) => ipcRenderer.invoke(Chanels.pictures_create, model).catch(e => fCatch(e)),
    read: (id: string) => ipcRenderer.invoke(Chanels.pictures_read, id).catch(e => fCatch(e)),
    update: (model: PictureI) => ipcRenderer.invoke(Chanels.pictures_update, model).catch(e => fCatch(e)),
    delete: (id: string) => ipcRenderer.invoke(Chanels.pictures_delete, id).catch(e => fCatch(e)),
    images: {
      download: (fileName: string) => ipcRenderer.invoke(Chanels.pictures_images_download, fileName).catch(e => fCatch(e)),
      on: {
        dowloaded: (listener: (event: IpcRendererEvent, result: boolean) => void) => {
          ipcRenderer.on(Chanels.pictures_images_downloaded, listener)
        },
        loaded: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => {
          ipcRenderer.on(Chanels.pictures_images_loaded, listener)
        },
        removed: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => {
          ipcRenderer.on(Chanels.pictures_images_removed, listener)
        }
      },
      off: {
        dowloaded: () => { ipcRenderer.removeAllListeners(Chanels.pictures_images_downloaded) },
        loaded: () => { ipcRenderer.removeAllListeners(Chanels.pictures_images_loaded) },
        removed: () => { ipcRenderer.removeAllListeners(Chanels.pictures_images_removed) }
      }
    }
  },
  similarPictures: {
    tableOptions: {
      get: () => ipcRenderer.invoke(Chanels.similarPictures_tableOptions_get).catch(e => fCatch(e)),
      setColumnVisibility: (model: object) => ipcRenderer.invoke(Chanels.similarPictures_tableOptions_setColumnVisibility, model).catch(e => fCatch(e)),
      setColumnOrder: (model: string[]) => ipcRenderer.invoke(Chanels.similarPictures_tableOptions_setColumnOrder, model).catch(e => fCatch(e)),
      setColumnSort:(model: ColumnSortI[]) => ipcRenderer.invoke(Chanels.similarPictures_tableOptions_setColumnSort, model).catch(e => fCatch(e)),
    }
  }
}

contextBridge.exposeInMainWorld('api', API)