import { IpcRendererEvent } from 'electron'
import ThemeI from '@shared/interfaces/themeI'
import PictureI from '@shared/interfaces/pictureI'
import AppSettingsI from '@shared/interfaces/appSettingsI'
import { ProcessingResultI } from '../ProcessingResultI'


export default interface ContextBridgeApiI {
  theme: {
    getCurrent: () => Promise<ThemeI>
    set: (settings: ThemeI) => Promise<ThemeI>
  },
  app: {
    getSettings: () => Promise<AppSettingsI>
    close: () => Promise<void>
  },
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    unmaximize: () => Promise<void>
    on: {
      unmaximized: (listener: (event: IpcRendererEvent, ...args: any[]) => void) => void
    },
    off: {
      unmaximized: () => void
    }
  },
  pictures: {
    getAll: () => Promise<PictureI[]>
    create: (picture: PictureI) => Promise<PictureI | undefined> //Promise<PictureI>
    read: (id: string) => Promise<PictureI>
    update: (picture: PictureI) => Promise<PictureI>
    delete: (id: string) => Promise<boolean>
    on: {
      pictureFilesLoaded: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => void,
      pictureFilesRemoved: (listener: (event: IpcRendererEvent, info: ProcessingResultI) => void) => void
    },
    off: {
      pictureFilesLoaded: () => void,
      pictureFilesRemoved: () => void
    }
  }
}