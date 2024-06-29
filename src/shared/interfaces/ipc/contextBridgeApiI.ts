import { IpcRendererEvent } from 'electron'
import ThemeI from '@shared/interfaces/themeI'
import PictureI from '@shared/interfaces/pictureI'
import AppSettingsI from '@shared/interfaces/appSettingsI'
import ProcessingResultI from '@shared/interfaces/processingResultI'
import PicturesDefaultSetI from '@shared/interfaces/picturesDefaultSetI'
import TableOptionsI from '@shared/interfaces/tableOptionsI'
import { ColumnSortI } from '@shared/interfaces/columnSortI'
import { CurrencyI } from '@shared/interfaces/currencyI'


export default interface ContextBridgeApiI {
  theme: {
    getCurrent: () => Promise<ThemeI>
    set: (model: ThemeI) => Promise<ThemeI>
  }
  currency: {
    getCurrent: () => Promise<CurrencyI>
    set: (model: CurrencyI) => Promise<CurrencyI>
    on: {
      currencyChenged: (listener: (event: IpcRendererEvent, currency: CurrencyI) => void) => void
    }
    off: {
      currencyChenged: () => void
    }
  }
  app: {
    getSettings: () => Promise<AppSettingsI>
    close: () => Promise<void>
  }
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    unmaximize: () => Promise<void>
    on: {
      unmaximized: (listener: (event: IpcRendererEvent) => void) => void
    }
    off: {
      unmaximized: () => void
    }
  }
  picturesDefaultSet: {
    tableOptions: {
      get: () => Promise<TableOptionsI>
      setColumnVisibility: (model: object) => Promise<object>
      setColumnOrder: (model: string[]) => Promise<string[]>
      setColumnSort: (model: ColumnSortI[]) => Promise<ColumnSortI[]>
    }
    get: () => Promise<PicturesDefaultSetI>
    set: (model: PicturesDefaultSetI) => Promise<PicturesDefaultSetI>
    on: {
      defaultSetChenged: (listener: (_event: IpcRendererEvent, defaultSet: PicturesDefaultSetI) => void) => void
    }
    off: {
      defaultSetChenged: () => void
    }
  }
  pictureDetail: {
    tableOptions: {
      get: () => Promise<TableOptionsI>
      setColumnVisibility: (model: object) => Promise<object>
      setColumnOrder: (model: string[]) => Promise<string[]>
      setColumnSort: (model: ColumnSortI[]) => Promise<ColumnSortI[]>
    }
  }
  pictures: {
    tableOptions: {
      get: () => Promise<TableOptionsI>
      setColumnVisibility: (model: object) => Promise<object>
      setColumnOrder: (model: string[]) => Promise<string[]>
      setColumnSort: (model: ColumnSortI[]) => Promise<ColumnSortI[]>
    }
    getAll: () => Promise<PictureI[]>
    create: (model: PictureI) => Promise<PictureI>
    read: (id: string) => Promise<PictureI>
    update: (model: PictureI) => Promise<PictureI>
    delete: (id: string) => Promise<boolean>
    images: {
      download: (fileName: string) => Promise<void>
      on: {
        dowloaded: (listener: (event: IpcRendererEvent, result: boolean) => void) => void
        loaded: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => void
        removed: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => void
      },
      off: {
        dowloaded: () => void
        loaded: () => void
        removed: () => void
      }
    }
  }
  similarPictures: {
    tableOptions: {
      get: () => Promise<TableOptionsI>
      setColumnVisibility: (model: object) => Promise<object>
      setColumnOrder: (model: string[]) => Promise<string[]>
      setColumnSort: (model: ColumnSortI[]) => Promise<ColumnSortI[]>
    }
  }
}