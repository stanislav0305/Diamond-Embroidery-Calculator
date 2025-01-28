import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import ThemeI from '@shared/interfaces/themeI'
import PictureI from '@shared/interfaces/pictureI'
import ContextBridgeApiI from '@shared/interfaces/ipc/contextBridgeApiI'
import Channels from '@shared/interfaces/ipc/channels'
import ProcessingResultI from '@shared/interfaces/processingResultI'
import PicturesDefaultSetI from '@shared/interfaces/picturesDefaultSetI'
import { ColumnSortI } from '@shared/interfaces/columnSortI'
import { CurrencyI } from '@shared/interfaces/currencyI'


const fCatch = (e: Error) => {
  console.error(e)
  throw e
}

const API: ContextBridgeApiI = {
  theme: {
    getCurrent: () => ipcRenderer.invoke(Channels.theme_getCurrent).catch(e => fCatch(e)),
    set: (model: ThemeI) => ipcRenderer.invoke(Channels.theme_set, model).catch(e => fCatch(e)),
  },
  currency: {
    getCurrent: () => ipcRenderer.invoke(Channels.currency_getCurrent).catch(e => fCatch(e)),
    set: (model: CurrencyI) => ipcRenderer.invoke(Channels.currency_set, model).catch(e => fCatch(e)),
    on: {
      currencyChanged: (listener: (event: IpcRendererEvent, currency: CurrencyI) => void) => {
        ipcRenderer.on(Channels.currency_currencyChanged, listener)
      }
    },
    off: {
      currencyChanged: () => { ipcRenderer.removeAllListeners(Channels.currency_currencyChanged) }
    }
  },
  app: {
    getSettings: () => ipcRenderer.invoke(Channels.app_getSettings).catch(e => fCatch(e)),
    close: () => ipcRenderer.invoke(Channels.app_close).catch(e => fCatch(e))
  },
  window: {
    minimize: () => ipcRenderer.invoke(Channels.window_minimize).catch(e => fCatch(e)),
    maximize: () => ipcRenderer.invoke(Channels.window_maximize).catch(e => fCatch(e)),
    unmaximize: () => ipcRenderer.invoke(Channels.window_unmaximize).catch(e => fCatch(e)),
    on: {
      unmaximized: (listener: (event: IpcRendererEvent) => void) => {
        ipcRenderer.on(Channels.unmaximized, listener)
      }
    },
    off: {
      unmaximized: () => { ipcRenderer.removeAllListeners(Channels.unmaximized) }
    }
  },
  picturesDefaultSet: {
    tableOptions: {
      get: () => ipcRenderer.invoke(Channels.picturesDefaultSet_tableOptions_get).catch(e => fCatch(e)),
      setColumnVisibility: (model: object) => ipcRenderer.invoke(Channels.picturesDefaultSet_tableOptions_setColumnVisibility, model).catch(e => fCatch(e)),
      setColumnOrder: (model: string[]) => ipcRenderer.invoke(Channels.picturesDefaultSet_tableOptions_setColumnOrder, model).catch(e => fCatch(e)),
      setColumnSort: (model: ColumnSortI[]) => ipcRenderer.invoke(Channels.picturesDefaultSet_tableOptions_setColumnSort, model).catch(e => fCatch(e)),
    },
    get: () => ipcRenderer.invoke(Channels.picturesDefaultSet_get).catch(e => fCatch(e)),
    set: (model: PicturesDefaultSetI) => ipcRenderer.invoke(Channels.picturesDefaultSet_set, model).catch(e => fCatch(e)),
    on: {
      defaultSetChanged: (listener: (_event: IpcRendererEvent, defaultSet: PicturesDefaultSetI) => void) => {
        ipcRenderer.on(Channels.picturesDefaultSet_defaultSetChanged, listener)
      }
    },
    off: {
      defaultSetChanged: () => { ipcRenderer.removeAllListeners(Channels.picturesDefaultSet_defaultSetChanged) }
    },
  },
  pictureDetail: {
    tableOptions: {
      get: () => ipcRenderer.invoke(Channels.pictureDetail_tableOptions_get).catch(e => fCatch(e)),
      setColumnVisibility: (model: object) => ipcRenderer.invoke(Channels.pictureDetail_tableOptions_setColumnVisibility, model).catch(e => fCatch(e)),
      setColumnOrder: (model: string[]) => ipcRenderer.invoke(Channels.pictureDetail_tableOptions_setColumnOrder, model).catch(e => fCatch(e)),
      setColumnSort: (model: ColumnSortI[]) => ipcRenderer.invoke(Channels.pictureDetail_tableOptions_setColumnSort, model).catch(e => fCatch(e)),
    }
  },
  pictures: {
    tableOptions: {
      get: () => ipcRenderer.invoke(Channels.pictures_tableOptions_get).catch(e => fCatch(e)),
      setColumnVisibility: (model: object) => ipcRenderer.invoke(Channels.pictures_tableOptions_setColumnVisibility, model).catch(e => fCatch(e)),
      setColumnOrder: (model: string[]) => ipcRenderer.invoke(Channels.pictures_tableOptions_setColumnOrder, model).catch(e => fCatch(e)),
      setColumnSort: (model: ColumnSortI[]) => ipcRenderer.invoke(Channels.pictures_tableOptions_setColumnSort, model).catch(e => fCatch(e)),
    },
    getAll: () => ipcRenderer.invoke(Channels.pictures_getAll).catch(e => fCatch(e)),
    create: (model: PictureI) => ipcRenderer.invoke(Channels.pictures_create, model).catch(e => fCatch(e)),
    read: (id: string) => ipcRenderer.invoke(Channels.pictures_read, id).catch(e => fCatch(e)),
    update: (model: PictureI) => ipcRenderer.invoke(Channels.pictures_update, model).catch(e => fCatch(e)),
    delete: (id: string) => ipcRenderer.invoke(Channels.pictures_delete, id).catch(e => fCatch(e)),
    images: {
      download: (fileName: string) => ipcRenderer.invoke(Channels.pictures_images_download, fileName).catch(e => fCatch(e)),
      on: {
        downloaded: (listener: (event: IpcRendererEvent, result: boolean) => void) => {
          ipcRenderer.on(Channels.pictures_images_downloaded, listener)
        },
        loaded: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => {
          ipcRenderer.on(Channels.pictures_images_loaded, listener)
        },
        removed: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => {
          ipcRenderer.on(Channels.pictures_images_removed, listener)
        }
      },
      off: {
        downloaded: () => { ipcRenderer.removeAllListeners(Channels.pictures_images_downloaded) },
        loaded: () => { ipcRenderer.removeAllListeners(Channels.pictures_images_loaded) },
        removed: () => { ipcRenderer.removeAllListeners(Channels.pictures_images_removed) }
      }
    }
  },
  similarPictures: {
    tableOptions: {
      get: () => ipcRenderer.invoke(Channels.similarPictures_tableOptions_get).catch(e => fCatch(e)),
      setColumnVisibility: (model: object) => ipcRenderer.invoke(Channels.similarPictures_tableOptions_setColumnVisibility, model).catch(e => fCatch(e)),
      setColumnOrder: (model: string[]) => ipcRenderer.invoke(Channels.similarPictures_tableOptions_setColumnOrder, model).catch(e => fCatch(e)),
      setColumnSort: (model: ColumnSortI[]) => ipcRenderer.invoke(Channels.similarPictures_tableOptions_setColumnSort, model).catch(e => fCatch(e)),
    }
  }
}

contextBridge.exposeInMainWorld('api', API)